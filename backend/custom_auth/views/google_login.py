from rest_framework.response import Response
from django.http import HttpResponseRedirect
from rest_framework.views import APIView
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
import datetime
import jwt
import requests
from custom_auth.models import *
from custom_auth.lib import is_admin
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import urlparse
from custom_auth.s import *
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
        from urllib.parse import urlencode
        url = f"{base_url}?{urlencode(params)}"
        return Response({"redirect_url": url})



class GoogleCallbackView(APIView):
    
    def get(self,request):
        code = request.GET.get("code")
        if not code:
            frontend_url = f"{settings.FRONTEND_URL}?login=error&reason=not_code_provided"
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
            frontend_url = f"{settings.FRONTEND_URL}?login=error&reason=failed_to_get_token"
            response = HttpResponseRedirect(frontend_url)
            return response
        
        token_data = r.json()
        access_token = token_data.get("access_token")

        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}

        r = requests.get(user_info_url, headers=headers)
        if r.status_code != 200:
            frontend_url = f"{settings.FRONTEND_URL}?login=error&reason=not_user_data"
            response = HttpResponseRedirect(frontend_url)
            return response
        
        user_data = r.json()
        email = user_data.get("email")
        username = email.split("@")[0]
        

        random_password = get_random_string(length=12) 
        user, created = User.objects.get_or_create(email=email, defaults={"username": username,"password": make_password(random_password) })
        

        payload = {
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
        }
        jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

        

        rurl = settings.FRONTEND_URL.split(",")[-1].strip() if is_admin(request) else settings.FRONTEND_URL.split(",")[0].strip() 

        response = HttpResponseRedirect(rurl)
        response.set_cookie(
            key="access_token",
            value=jwt_token,
            httponly=True, 
            secure=True,  
            samesite="None",
            domain=urlparse(settings.HOST).hostname,  
            path="/",
            max_age=24*60*60
        )

        return response
    