import { Routes } from '@angular/router';

import {Login} from './pages/login/login';
import {Register} from './pages/register/register';
import {Reservations} from './pages/reservations/reservations';
import {Menu} from './pages/menu/menu';
import {Contact} from './pages/contact/contact';
import {Home} from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' }, // 👈 ADD THIS LINE
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'reservations', component: Reservations },
  { path: 'menu', component: Menu },
  { path: 'contact', component: Contact },
];
