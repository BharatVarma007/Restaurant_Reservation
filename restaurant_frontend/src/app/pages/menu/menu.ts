import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html'
})
export class Menu {
  menuItems: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/menu/items/').subscribe({
      next: data => {
        this.menuItems = data;
      },
      error: error => {
        console.error('Failed to load menu items:', error);
      }
    });
  }
}
