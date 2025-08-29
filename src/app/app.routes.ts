import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  // 1) raíz -> login
   { path: '', redirectTo: 'login', pathMatch: 'full' },
     // 2) login SIN layout
  { path: 'login', component: LoginComponent },

  // resto de páginas CON layout
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      // agrega aquí más rutas protegidas por layout:
      // { path: 'causante', component: CausanteComponent },
      //{ path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // catch-all
  { path: '**', redirectTo: 'login' }
];