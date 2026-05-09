from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'multi_device_sync', 'created_at')

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'multi_device_sync')
        extra_kwargs = {
            'multi_device_sync': {'required': False}
        }


class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField() 
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'multi_device_sync', 'code')
        extra_kwargs = {
            'multi_device_sync': {'required': False}
        }
