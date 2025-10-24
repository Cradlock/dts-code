from django.contrib.auth.backends import ModelBackend
from .models import *
from .lib import *
from .s import *

from rest_framework.permissions import BasePermission



class UsernameOrEmailBackend(ModelBackend):

    def authenticate(self, request, username=None, password=None, **kwargs):
        us = is_authenticate(request)
        if us is not None:
            return us 
        

        if username is None:
            username = kwargs.get("email")
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=username)
            except User.DoesNotExist:
                return None
        if user.check_password(password) and self.user_can_authenticate(user):

            return user
        return None
    
    def get_user(self, user_id):
        try:
           return User.objects.get(pk=user_id)
        except User.DoesNotExist:
           return None
    
