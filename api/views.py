from django.shortcuts import render
from rest_framework import generics, status
from .models import Room, RoomParticipant
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse


# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


def upsert_room_participant(room, session_key):
    RoomParticipant.objects.update_or_create(
        room=room,
        session_id=session_key,
        defaults={"last_sync_error": ""},
    )


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                if not self.request.session.exists(self.request.session.session_key):
                    self.request.session.create()
                self.request.session['room_code'] = code
                upsert_room_participant(room[0], self.request.session.session_key)
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room not found': 'Invalid room code'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                upsert_room_participant(room, self.request.session.session_key)
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            return Response({'Room not found': 'Invalid room code'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            multi_device_sync = serializer.data.get('multi_device_sync', False)
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.multi_device_sync = multi_device_sync
                room.save(update_fields=['guest_can_pause', 'votes_to_skip', 'multi_device_sync'])
                self.request.session['room_code'] = room.code
                upsert_room_participant(room, self.request.session.session_key)
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    votes_to_skip=votes_to_skip,
                    multi_device_sync=multi_device_sync,
                )
                room.save()
                self.request.session['room_code'] = room.code
                upsert_room_participant(room, self.request.session.session_key)
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            
        return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        room_code = self.request.session.get('room_code')
        if room_code and not Room.objects.filter(code=room_code).exists():
            self.request.session.pop('room_code')
            room_code = None

        data = {
            'code': room_code
        }
        return JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            room_code = self.request.session.get('room_code')
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            if room_code:
                RoomParticipant.objects.filter(room__code=room_code, session_id=host_id).delete()
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
        return Response({'Message': 'Room deleted'}, status=status.HTTP_200_OK)


class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            multi_device_sync = serializer.data.get('multi_device_sync')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'Room not found': 'Invalid room code'}, status=status.HTTP_404_NOT_FOUND)
            
            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'Message': 'You are not the host of this room'}, status=status.HTTP_403_FORBIDDEN)
            
            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            if multi_device_sync is not None:
                room.multi_device_sync = multi_device_sync
            room.save(update_fields=['guest_can_pause', 'votes_to_skip', 'multi_device_sync'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response({'Bad request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
