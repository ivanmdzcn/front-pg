import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { CausanteListComponent } from './pages/causantes/causante-list/causante-list.component';
import { CausanteCreateComponent } from './pages/causantes/causante-create/causante-create.component';
import { CausanteEditComponent } from './pages/causantes/causante-edit/causante-edit.component';
import { authGuard } from './core/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },    // 1) raíz -> login
  { path: 'login', component: LoginComponent },             // 2) login SIN layout

  // resto de páginas CON layout
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],        // 👈 protege el layout
    canActivateChild: [authGuard],   // 👈 protege también los hijos
    children: [
      // agrega aquí más rutas protegidas por layout:
      { path: 'home', component: HomeComponent },
      { path: 'causantes', component: CausanteListComponent }, 
      { path: 'causantes/nuevo', component: CausanteCreateComponent },  
      { path: 'causantes/:id/editar', component: CausanteEditComponent }, 
    ]
  },

  // catch-all
  { path: '**', redirectTo: 'login' }
];