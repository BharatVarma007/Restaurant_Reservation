from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TableViewSet, TimeSlotViewSet, ReservationViewSet

router = DefaultRouter()
router.register(r'tables', TableViewSet)
router.register(r'timeslots', TimeSlotViewSet)
router.register(r'bookings', ReservationViewSet,basename='reservation')

urlpatterns = [
    path('', include(router.urls)),
]
