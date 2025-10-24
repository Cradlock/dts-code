from .view_base import *
from .view_google import *
    

def login_view(request):
    if request.method != "POST":
        return HttpResponse("Method not allowed",status=500) 
    
    username = request.POST.get("username")
    password = request.POST.get("password")

    if username is None:
        return  HttpResponse("Not enough data",status=400)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            return HttpResponse("Unauthorized",status=401)
        
    if user.check_password(password):

        is_admin = user.is_staff or user.is_superuser

        res = JsonResponse({"is_admin": is_admin}, status=200)
        
        setAuthCookie(res,getJWT(user.id) )
        return res
    
    
    return HttpResponse("Unautorized",status=401)

def signup_view(request):
    if request.method == "GET":
        return render(request,"signup.html")
    if request.method != "POST":
        return HttpResponse("Method not allowed",status=500)
    
    username = request.POST.get("username")
    email = request.POST.get("email")
    password = request.POST.get("password")

    if password is None:
        return JsonResponse({"error": "Данных не хватает"}, status=400)
        
    if email is None and username is None:
        return JsonResponse({"error": "Данных не хватает"}, status=400)
    
    if email is None:
        return JsonResponse({"error": "Данных не хватает"}, status=400)
    
    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email уже занят"}, status=403)
    

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username уже занят"}, status=403)
    


    user = User.objects.create_user(username=username,email=email,password=password,is_active=False)
    
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    verify_link = f"{settings.HOST}/accounts/google/verify/{uidb64}/{token}/"
    
    send_email(email,"Подверждение аккаунта",verify_link)

    return JsonResponse({"data":"Ok"},status=200)


    
def logout_view(request):
    
    response = HttpResponseRedirect(settings.FRONTEND_URL.split(",")[0].strip())
    response.set_cookie(
        key="access_token",
        value="",
        httponly=True,
        secure=True,
        samesite="None",
        path="/",
        domain=urlparse(settings.HOST).hostname,
        expires="Thu, 01 Jan 1970 00:00:00 GMT",
        max_age=0
    )
    return response

class VerifyEmailView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return JsonResponse({"error": "Неверная ссылка"}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_active:
            return JsonResponse({"error": "Аккаунт уже подтверждён"}, status=status.HTTP_403_FORBIDDEN)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()


            response = HttpResponseRedirect( settings.FRONTEND_URL.split(",")[-1] if is_admin(request) else settings.FRONTEND_URL.split(",")[-1] )
            setAuthCookie( response,getJWT(user.id) )


            return response

        else:
            return JsonResponse({"error": "Токен недействителен или просрочен"}, status=status.HTTP_400_BAD_REQUEST)
class BucketViewList(APIView):
    permission_classes = [CustomPermDoubleClass,]

    def get(self,request):
        user = get_object_or_404(Profile,pk=get_id(request))
        items = user.cart_items.all()
        serializer = OrderItem_S(items, many=True)
        return Response(serializer.data) 

    def post(self, request):
        user = get_object_or_404(Profile, pk=get_id(request))
        product_id = request.data.get('product') 
        count = int(request.data.get('count', 1)) 

        if not product_id:
            return Response({"error": "product is required"}, status=400)

        
        item, created = OrderItem.objects.get_or_create(
            user=user,
            product_id=product_id,
            defaults={'count': 1}
        )

        if not created:
            item.count += count
            item.save()

        serializer = OrderItem_S(item, context={'request': request})
        return Response(serializer.data, status=201)
    
class BucketViewDetail(APIView):
    permission_classes = [CustomPermDoubleClass,]

    def put(self, request, pk):
        user = get_object_or_404(Profile, pk=get_id(request))
        item = get_object_or_404(user.cart_items, pk=pk)
        operation = request.data.get("operation", None)
    
        if operation is None:
            return Response(status=status.HTTP_409_CONFLICT)
    
        # Работаем напрямую с count
        if operation.isdigit():
            new_count = int(operation)
            if new_count > 0:
                item.count = new_count
                item.save()
            elif new_count == 0:
                item.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
    
        elif operation == "inc":
            item.count += 1
            item.save()
    
        elif operation == "dec":
            if item.count <= 1:
                item.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                item.count -= 1
                item.save()
    
        return Response({"id": item.id, "count": item.count}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        user = get_object_or_404(Profile,pk=get_id(request))
        item = get_object_or_404(user.cart_items, pk=pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@csrf_exempt
def reset_password(request):
    if request.method == "GET":
        return render(request,"resForm.html")
    if request.method != "POST":
        return JsonResponse({"error":"Method not allowed"},status=503)
    
    email = request.POST.get("email",None)
    if not email:
        return JsonResponse({"error":"Не хватает данных"},status=400)
    
    user = User.objects.filter(email=email).first()
    if user is None:
        return JsonResponse({"error":"Нет такого пользователя"},status=403)
    
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    verify_link = f"{settings.HOST}/accounts/password/verify/{uidb64}/{token}/"
    
    send_email(email,"Сброса пароля",verify_link)

    return JsonResponse({"data":"Ok"},status=200)



class VerifyResetPassword(APIView):
    template_name = "reset.html"

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return HttpResponse("Неверная или устаревшая ссылка", status=400)

        if default_token_generator.check_token(user, token):
            
            response = HttpResponseRedirect( settings.FRONTEND_URL.split(",")[0] )
            setAuthCookie(response,getJWT(user.id))
            return response
            
        else:
            return HttpResponse("Ссылка недействительна или уже использована", status=400)

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return JsonResponse({"error": "Неверная ссылка"}, status=400)

        if not default_token_generator.check_token(user, token):
            return JsonResponse({"error": "Ссылка недействительна"}, status=400)

        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")

        if not password1 or not password2:
            return JsonResponse({"error": "Введите пароль дважды"}, status=400)
        if password1 != password2:
            return JsonResponse({"error": "Пароли не совпадают"}, status=400)

        # Сбрасываем пароль
        user.set_password(password1)
        user.save()

        response = HttpResponseRedirect(settings.FRONTEND_URL.split(",")[0].strip() )
        
        setAuthCookie(response,getJWT(user.id))
        return response
    
@csrf_exempt
def getUser(request):
    user = is_authenticate(request)
    if not user:
        return HttpResponse("Forbidden",status=403)
    
    return JsonResponse(Profile_s(user).data ,status=200)

@csrf_exempt
def setNumber(request):
    user = is_authenticate(request)
    if not user:
        return JsonResponse({"error":"Not authenticate"},status=403)
    
    number = request.GET.get("number")
    if not number or not is_valid_phone(number):
        return JsonResponse({"error":"Not defined number"},status=400)
    
    user.phone_number = number 
    user.save()
    return JsonResponse({"data":"Set number"},status=200)


def getInfo(request):
    obj = Info.objects.last()

    if obj is None:
        return JsonResponse({"data":"Not Info obj"},status=500)
    
    return JsonResponse(Info_s(obj,context={"request":request}).data,status=200)




