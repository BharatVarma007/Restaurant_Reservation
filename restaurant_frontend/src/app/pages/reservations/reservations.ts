import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './reservations.html',
})
export class Reservations implements OnInit {
  tables: any[] = [];
  timeslots: any[] = [];
  selectedTable: number | null = null;
  selectedTimeslot: number | null = null;
  date: string = '';
  successMessage = '';
  errorMessage = '';
  nextAvailable: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTables();
    this.loadTimeslots();
  }



  loadTables() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/reservations/tables/')
      .subscribe(data => this.tables = data);
  }

  loadTimeslots() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/reservations/timeslots/')
      .subscribe(data => this.timeslots = data);
  }

  bookTable() {
  this.successMessage = '';
  this.errorMessage = '';
  this.nextAvailable = '';

  const token = localStorage.getItem('access_token');

  if (!token || !this.selectedTable || !this.selectedTimeslot || !this.date) {
    this.errorMessage = 'Please fill all fields.';
    return;
  }


  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  const body = {
    user: 1,
    table: this.selectedTable,
    timeslot: this.selectedTimeslot,
    date: this.date,
  };

  this.http.post('http://127.0.0.1:8000/api/reservations/bookings/', body, { headers }).subscribe({
    next: () => {
      this.successMessage = 'Reservation successful!';
    },
    error: () => {
      this.getNextAvailableSlot(this.selectedTable!);
    },
  });
}


  getNextAvailableSlot(tableId: number) {
    this.http.get<any>(`http://127.0.0.1:8000/api/reservations/bookings/next-available/?table_id=${tableId}`)
      .subscribe({
        next: (res) => {
          this.errorMessage = 'Selected time is unavailable.';
          this.nextAvailable = `Next available time: ${res.next_available_timeslot} on ${res.date}`;
        },
        error: () => {
          this.errorMessage = 'Selected time is unavailable and no next slot found.';
        }
      });
  }
}
