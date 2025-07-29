from django.shortcuts import render
from rest_framework import viewsets
from .models import Table, TimeSlot, Reservation
from .serializers import TableSerializer, TimeSlotSerializer, ReservationSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, permissions
from datetime import date as today_date, timedelta

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]


class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='availability', permission_classes=[permissions.AllowAny])
    def availability(self, request):
        timeslot_id = request.query_params.get('timeslot_id')

        if not timeslot_id:
            return Response({"error": "Missing timeslot_id parameter."}, status=400)

        try:
            timeslot = TimeSlot.objects.get(pk=timeslot_id)
        except TimeSlot.DoesNotExist:
            return Response({"error": "Invalid timeslot ID."}, status=404)

        today = today_date.today()

        reserved_table_ids = Reservation.objects.filter(
            date=today,
            timeslot=timeslot
        ).values_list('table_id', flat=True)

        available_tables = Table.objects.exclude(id__in=reserved_table_ids)

        data = [
            {
                "id": table.id,
                "table_number": table.table_number,
                "capacity": table.capacity
            } for table in available_tables
        ]

        return Response({
            "date": today.isoformat(),
            "timeslot": str(timeslot),
            "available_tables": data
        })

    @action(detail=False, methods=['get'], url_path='next-available', permission_classes=[permissions.AllowAny])
    def next_available(self, request):
        table_id = request.query_params.get('table_id')
        if not table_id:
            return Response({"error": "Missing table_id parameter."}, status=400)

        try:
            table = Table.objects.get(pk=table_id)
        except Table.DoesNotExist:
            return Response({"error": "Invalid table ID."}, status=404)

        today = today_date.today()
        max_days = 30  # search up to 30 days ahead

        for day_offset in range(max_days):
            check_date = today + timedelta(days=day_offset)
            for timeslot in TimeSlot.objects.all():
                if not Reservation.objects.filter(date=check_date, table=table, timeslot=timeslot).exists():
                    return Response({
                        "next_available_date": check_date.isoformat(),
                        "timeslot": str(timeslot),
                        "table_id": table.id,
                        "table_number": table.table_number
                    })

        return Response({"message": "No available slots for this table in the next 30 days."})
