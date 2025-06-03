from django.db import models
from api.models import Room


class SpotifyToken(models.Model):
    user = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.TextField(max_length=255, default="", null=False)
    access_token = models.TextField(max_length=255)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=255)
    
class Vote(models.Model):
    user = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    song_id = models.CharField(max_length=255)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
