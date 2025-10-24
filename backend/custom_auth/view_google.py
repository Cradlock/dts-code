from django.contrib.auth.backends import ModelBackend
from rest_framework.response import Response
from django.http import HttpResponseRedirect
from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework import status
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
import datetime
import jwt
import requests
from .models import *
from .lib import *
from django.http import JsonResponse,HttpResponse
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import urlparse
from .s import *
from django.shortcuts import get_object_or_404
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes,force_str
User = Profile






class GoogleRedirectView(APIView):
    

    def get(self,request):
        base_url = "https://accounts.google.com/o/oauth2/v2/auth"
        params = {
            "client_id": settings.GOOGLE_PUBLIC_ID,
            "redirect_uri": settings.HOST + "/accounts/google/callback/",
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "online",
            "prompt": "consent"
        }
        print("🚀 redirect_uri:", params)
        from urllib.parse import urlencode
        url = f"{base_url}?{urlencode(params)}"
        return Response({"redirect_url": url})



class GoogleCallbackView(APIView):
    
    def get(self,request):
        code = request.GET.get("code")
        if not code:
            frontend_url = f"{settings.FRONT}?login=error&reason=not_code_provided"
            response = HttpResponseRedirect(frontend_url)
            return response
        
        token_url = "https://oauth2.googleapis.com/token"

        data = {
            "code":code,
            "client_id": settings.GOOGLE_PUBLIC_ID,
            "client_secret": settings.GOOGLE_SECRET_KEY,
            "redirect_uri": settings.HOST + "/accounts/google/callback/",
            "grant_type": "authorization_code"
        }

        r = requests.post(token_url, data=data)
        if r.status_code != 200:
            frontend_url = f"{settings.FRONT}?login=error&reason=failed_to_get_token"
            response = HttpResponseRedirect(frontend_url)
            return response
        
        token_data = r.json()
        access_token = token_data.get("access_token")

        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}

        r = requests.get(user_info_url, headers=headers)
        rurl = settings.FRONT
        if r.status_code != 200:
            frontend_url = f"{rurl}?login=error&reason=not_user_data"
            response = HttpResponseRedirect(frontend_url)
            return response
        
        user_data = r.json()
        email = user_data.get("email")
        username = email.split("@")[0]
        

        random_password = get_random_string(length=12) 
        user, created = User.objects.get_or_create(email=email, defaults={"username": username,"password": make_password(random_password)})
        
        rurl = settings.FRONT
        response = HttpResponseRedirect(rurl)
        setAuthCookie(response, getJWT(user.id) )
        return response
    
