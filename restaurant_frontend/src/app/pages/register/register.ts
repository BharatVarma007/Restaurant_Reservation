import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
})
export class Register {
  username = '';
  password = '';
  error: string | null = null;
  success: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.error = null;
    this.success = null;

    this.http.post('http://127.0.0.1:8000/api/auth/register/', {
      username: this.username,
      password: this.password,
    }).subscribe({
      next: () => {
        this.success = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: err => {
        this.error = err.error?.message || 'Registration failed';
      }
    });
  }
}
