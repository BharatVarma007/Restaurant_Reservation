import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html'
})
export class Contact {
  name = '';
  email = '';
  message = '';
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  submitContactForm() {
    if (!this.name || !this.email || !this.message) {
      this.errorMessage = 'Please fill all the fields.';
      this.successMessage = '';
      return;
    }

    const contactData = {
      name: this.name,
      email: this.email,
      message: this.message
    };

    this.http.post('http://127.0.0.1:8000/api/contact/messages/', contactData).subscribe({
      next: () => {
        this.successMessage = 'Thank you! Your message has been sent.';
        this.errorMessage = '';
        this.name = '';
        this.email = '';
        this.message = '';
      },
      error: err => {
        this.errorMessage = 'Something went wrong. Please try again later.';
        this.successMessage = '';
        console.error(err);
      }
    });
  }
}
