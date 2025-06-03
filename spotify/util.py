from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get


BASE_URL = "https://api.spotify.com/v1/me/"


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    return user_tokens.first()


def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token=None):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        if refresh_token:
            tokens.refresh_token = refresh_token
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        SpotifyToken.objects.create(
            user=session_id,
            access_token=access_token,
            refresh_token=refresh_token or "",
            token_type=token_type,
            expires_in=expires_in
        )


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        if tokens.expires_in <= timezone.now():
            refresh_spotify_token(session_id)
        return True
    return False


def refresh_spotify_token(session_id):
    tokens = get_user_tokens(session_id)
    if not tokens:
        return

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': tokens.refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    })

    if response.status_code != 200:
        print("Error refreshing token:", response.text)
        return

    data = response.json()

    access_token = data.get('access_token')
    token_type = data.get('token_type')
    expires_in = data.get('expires_in')

    update_or_create_user_tokens(
        session_id,
        access_token,
        token_type,
        expires_in,
    )


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    if not tokens:
        return {'Error': 'User not authenticated'}

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f"Bearer {tokens.access_token}"
    }

    if post_:
        response = post(BASE_URL + endpoint, headers=headers)
    elif put_:
        response = put(BASE_URL + endpoint, headers=headers)
    else:
        response = get(BASE_URL + endpoint, headers=headers)

    try:
        if response.status_code == 204:
            return {'Success': 'Request was successful but no content returned'}
        return response.json()
    except Exception as e:
        return {'Error': f'Issue with request: {str(e)}'}


def play_song(session_id):
    return execute_spotify_api_request(session_id, 'player/play', put_=True)


def pause_song(session_id):
    return execute_spotify_api_request(session_id, 'player/pause', put_=True)

def skip_song(session_id):
    return execute_spotify_api_request(session_id, 'player/next', post_=True)