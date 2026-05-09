from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from api.models import Room, RoomParticipant
from .models import Vote


class AuthURL(APIView):
    def get(self, request, fornat=None):
        if not CLIENT_ID or not CLIENT_SECRET:
            return Response(
                {'error': 'Spotify credentials are not configured on the server.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        redirect_uri = REDIRECT_URI or request.build_absolute_uri('/spotify/redirect')
        request.session['spotify_redirect_uri'] = redirect_uri

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': redirect_uri,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')
    redirect_uri = request.session.get('spotify_redirect_uri') or REDIRECT_URI or request.build_absolute_uri('/spotify/redirect')

    if error:
        return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    if not access_token or not token_type or not expires_in:
        return Response({'error': error or 'Failed to authenticate with Spotify'}, status=status.HTTP_400_BAD_REQUEST)

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    room_code = request.session.get('room_code')
    if room_code:
        RoomParticipant.objects.filter(room__code=room_code, session_id=request.session.session_key).update(
            spotify_linked=True,
            last_sync_error="",
        )

    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


def get_room_for_session(request):
    room_code = request.session.get('room_code')
    if not room_code:
        return None
    room = Room.objects.filter(code=room_code).first()
    return room


def sync_participants_from_host(room):
    if not room.multi_device_sync:
        return

    host_state = execute_spotify_api_request(room.host, "player/currently-playing")
    item = host_state.get('item') if isinstance(host_state, dict) else None
    song_uri = item.get('uri') if isinstance(item, dict) else None
    progress_ms = host_state.get('progress_ms', 0) if isinstance(host_state, dict) else 0
    is_playing = bool(host_state.get('is_playing')) if isinstance(host_state, dict) else False

    participants = RoomParticipant.objects.filter(room=room, spotify_linked=True, is_sync_enabled=True).exclude(
        session_id=room.host
    )

    for participant in participants:
        if not participant.selected_device_id:
            participant.last_sync_error = "No selected device"
            participant.save(update_fields=['last_sync_error', 'last_seen'])
            continue

        if song_uri:
            response = start_song_on_device(
                participant.session_id,
                participant.selected_device_id,
                song_uri=song_uri,
                progress_ms=progress_ms,
            )
        else:
            response = play_song(participant.session_id)

        if not is_playing:
            pause_song(participant.session_id)

        if isinstance(response, dict) and ("error" in response or "Error" in response):
            participant.last_sync_error = str(response.get("error") or response.get("Error"))
        else:
            participant.last_sync_error = ""
        participant.save(update_fields=['last_sync_error', 'last_seen'])


class CurrentSong(APIView):
    def _empty_song_payload(self, room=None):
        return {
            'title': 'Unknown Title',
            'artist': 'Unknown Artist',
            'duration': 1,
            'time': 0,
            'image_url': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'><rect width='100%25' height='100%25' fill='%23eceff1'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23607075' font-family='Arial' font-size='14'>No Cover</text></svg>",
            'is_playing': False,
            'votes': 0,
            'votes_required': room.votes_to_skip if room else 0,
            'id': '',
        }

    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response(self._empty_song_payload(), status=status.HTTP_200_OK)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)

        if (
            not isinstance(response, dict)
            or "error" in response
            or "Error" in response
            or "item" not in response
            or response.get("item") is None
        ):
            return Response(self._empty_song_payload(room), status=status.HTTP_200_OK)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        votes = len(Vote.objects.filter(room=room, song_id=song_id))
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }

        self.update_room_song(room, song_id)
        if room.multi_device_sync and self.request.session.session_key == room.host:
            sync_participants_from_host(room)

        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        current_song = room.current_song

        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=room).delete()


class PauseSong(APIView):
    def put(self, response, format=None):
        room = get_room_for_session(self.request)
        if room is None:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            if room.multi_device_sync:
                for participant in RoomParticipant.objects.filter(room=room, spotify_linked=True, is_sync_enabled=True):
                    if participant.session_id == room.host:
                        continue
                    pause_song(participant.session_id)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)


class PlaySong(APIView):
    def put(self, response, format=None):
        room = get_room_for_session(self.request)
        if room is None:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            sync_participants_from_host(room)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)


class SkipSong(APIView):
    def post(self, request, format=None):
        room = get_room_for_session(self.request)
        if room is None:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
            votes.delete()
            skip_song(room.host)
            sync_participants_from_host(room)
        else:
            vote = Vote(user=self.request.session.session_key,
                        room=room, song_id=room.current_song)
            vote.save()

        return Response({}, status.HTTP_204_NO_CONTENT)


class ParticipantDevices(APIView):
    def get(self, request, format=None):
        room = get_room_for_session(request)
        if room is None:
            return Response({'detail': 'Not in a room'}, status=status.HTTP_400_BAD_REQUEST)

        participant = RoomParticipant.objects.filter(room=room, session_id=request.session.session_key).first()
        if participant is None:
            return Response({'detail': 'Participant not found'}, status=status.HTTP_404_NOT_FOUND)

        if not is_spotify_authenticated(request.session.session_key):
            return Response({'detail': 'Spotify not authenticated', 'devices': []}, status=status.HTTP_200_OK)

        devices = get_user_devices(request.session.session_key)
        return Response({'devices': devices}, status=status.HTTP_200_OK)


class SelectParticipantDevice(APIView):
    def put(self, request, format=None):
        room = get_room_for_session(request)
        if room is None:
            return Response({'detail': 'Not in a room'}, status=status.HTTP_400_BAD_REQUEST)

        participant = RoomParticipant.objects.filter(room=room, session_id=request.session.session_key).first()
        if participant is None:
            return Response({'detail': 'Participant not found'}, status=status.HTTP_404_NOT_FOUND)

        device_id = request.data.get('device_id')
        if not device_id:
            return Response({'detail': 'device_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        devices = get_user_devices(request.session.session_key)
        selected_device = None
        for device in devices:
            if device.get('id') == device_id:
                selected_device = device
                break

        if selected_device is None:
            return Response({'detail': 'Device not found'}, status=status.HTTP_404_NOT_FOUND)

        participant.spotify_linked = True
        participant.selected_device_id = device_id
        participant.selected_device_name = selected_device.get('name', '')
        participant.last_sync_error = ""
        participant.save(
            update_fields=['spotify_linked', 'selected_device_id', 'selected_device_name', 'last_sync_error', 'last_seen']
        )

        if room.multi_device_sync:
            sync_participants_from_host(room)

        return Response({'detail': 'Device selected'}, status=status.HTTP_200_OK)


class ParticipantSyncStatus(APIView):
    def get(self, request, format=None):
        room = get_room_for_session(request)
        if room is None:
            return Response({'detail': 'Not in a room'}, status=status.HTTP_400_BAD_REQUEST)

        participant = RoomParticipant.objects.filter(room=room, session_id=request.session.session_key).first()
        if participant is None:
            return Response({'detail': 'Participant not found'}, status=status.HTTP_404_NOT_FOUND)

        data = {
            'spotify_authenticated': is_spotify_authenticated(request.session.session_key),
            'spotify_linked': participant.spotify_linked,
            'selected_device_id': participant.selected_device_id,
            'selected_device_name': participant.selected_device_name,
            'is_sync_enabled': participant.is_sync_enabled,
            'last_sync_error': participant.last_sync_error,
            'multi_device_sync': room.multi_device_sync,
        }
        return Response(data, status=status.HTTP_200_OK)
