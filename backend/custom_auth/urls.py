from django.urls import path,include
from .views import *


urlpatterns = [
    path("login/",login_view),
    path("signup/",signup_view),
    path("logout/",logout_view),  
    # google login
    path("google/login/", GoogleRedirectView.as_view()),
    path("google/callback/", GoogleCallbackView.as_view()),
    path("google/verify/<uidb64>/<token>/",VerifyEmailView.as_view()),  

    path("user/",getUser),
    path("bucket/",BucketViewList.as_view()),
    path("bucket/<int:pk>",BucketViewDetail.as_view()),
    path("user/number/",setNumber),


    path("password/reset/",reset_password),
    path("password/verify/<uidb64>/<token>/",VerifyResetPassword.as_view())


    

]


