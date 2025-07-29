# Register your models here.
from django.contrib import admin
from .models import Table, TimeSlot, Reservation

admin.site.register(Table)
admin.site.register(TimeSlot)
admin.site.register(Reservation)
