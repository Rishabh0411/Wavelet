from django.db import models
import string, random

def generate_unique_code():
    length = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break

    return code

# Create your models here.

class Room(models.Model):
    code = models.CharField(max_length=8,default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    multi_device_sync = models.BooleanField(null=False, default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=255, default="", blank=True)


class RoomParticipant(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="participants")
    session_id = models.CharField(max_length=50)
    spotify_linked = models.BooleanField(default=False)
    selected_device_id = models.CharField(max_length=255, blank=True, default="")
    selected_device_name = models.CharField(max_length=255, blank=True, default="")
    is_sync_enabled = models.BooleanField(default=True)
    last_sync_error = models.TextField(blank=True, default="")
    last_seen = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["room", "session_id"], name="unique_room_session_participant")
        ]
