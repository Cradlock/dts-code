from custom_auth.models import *
from rest_framework.generics import RetrieveAPIView,ListAPIView,RetrieveUpdateDestroyAPIView
from rest_framework import mixins, viewsets
from catalog.pag import *
from catalog.s import *
from custom_auth.lib import CustomPermTriClass
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse


class CategoryViewSet(mixins.ListModelMixin,mixins.CreateModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,viewsets.GenericViewSet):
    permission_classes = [CustomPermTriClass,]
    queryset = Category.objects.all()
    serializer_class = Category_s




class BrandViewSet(mixins.ListModelMixin,mixins.CreateModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,viewsets.GenericViewSet):
    permission_classes = [CustomPermTriClass,]
    queryset = Brand.objects.all()
    serializer_class = Brand_s





class LastObjectRetrieveAPIView(generics.GenericAPIView):
    
    queryset = Info.objects.all()
    serializer_class = Info_s
    permission_classes = [CustomPermClass,]

    def get(self, request, *args, **kwargs):
        obj = self.get_queryset().last() 
        if not obj:
            return Response({"detail": "Not found"}, status=200)
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

class info_get(LastObjectRetrieveAPIView):
    queryset = Info.objects.all()
    serializer_class = Info_s
    permission_classes = [CustomPermClass,]

def info_edit(request):
    if not is_admin(request):
        return HttpResponse("Forbidden", status=403)
    
    if request.method != "POST":
        return HttpResponse("Method not allowed", status=405)

    info, created = Info.objects.get_or_create(id=1,defaults={               
        "title": "Default Title",
        "logo": None,
        "telegramm": "",
        "instagramm": "",
        "whatsapp": "",
        "gmail": "",
        "contact_number": "",
        "cashier_numbers": request.POST.getlist("cashier_numbers",[]),
    })

    title = request.POST.get("title")
    telegramm = request.POST.get("telegramm")
    instagramm = request.POST.get("instagramm")
    whatsapp = request.POST.get("whatsapp")
    gmail = request.POST.get("gmail")
    contact_number = request.POST.get("contact_number")
    logo = request.FILES.get("logo")

    if title is not None:
        info.title = title
    if telegramm is not None:
        info.telegramm = telegramm
    if instagramm is not None:
        info.instagramm = instagramm
    if whatsapp is not None:
        info.whatsapp = whatsapp
    if gmail is not None:
        info.gmail = gmail
    if contact_number is not None:
        info.contact_number = contact_number
    if logo:
        if info.logo:
            info.logo.delete(save=False)
        info.logo = logo

    cashier_numbers = request.POST.getlist("cashier_numbers") 
    if cashier_numbers:
       info.cashier_numbers = cashier_numbers

    info.save()



    return JsonResponse({"data": Info_s(info,context={'request': request}).data}, status=200)

