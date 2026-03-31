import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get token from query parameters
        token_key = self.scope['query_string'].decode().split('token=')[-1].split('&')[0] if 'token=' in self.scope['query_string'].decode() else None

        if token_key:
            try:
                token = Token.objects.get(key=token_key)
                self.scope['user'] = token.user
            except Token.DoesNotExist:
                self.scope['user'] = AnonymousUser()
        else:
            self.scope['user'] = AnonymousUser()

        # Only allow authenticated users
        if self.scope['user'].is_authenticated:
            await self.channel_layer.group_add("notifications", self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'channel_name'):
            await self.channel_layer.group_discard("notifications", self.channel_name)

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"]
        }))