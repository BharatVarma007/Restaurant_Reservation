from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import ContactMessage
from .serializers import ContactMessageSerializer
from rest_framework.permissions import AllowAny,IsAdminUser

from rest_framework import viewsets, permissions
from .models import ContactMessage
from .serializers import ContactMessageSerializer

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]  # anyone can submit
        return [permissions.IsAdminUser()]  # only admins can view/update/delete
