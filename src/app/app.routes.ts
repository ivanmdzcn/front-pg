import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { CausanteListComponent } from './pages/causantes/causante-list/causante-list.component';
import { CausanteCreateComponent } from './pages/causantes/causante-create/causante-create.component';
import { CausanteEditComponent } from './pages/causantes/causante-edit/causante-edit.component';
import { authGuard } from './core/auth.guard';

// ...nominas...
import { NominasListComponent } from './pages/nominas/nominas-list/nominas-list.component';
import { NominaNewComponent } from './pages/nominas/nomina-new/nomina-new.component';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },    // 1) raíz -> login
  { path: 'login', component: LoginComponent },             // 2) login SIN layout

  // resto de páginas CON layout
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],        // proteger el layout
    canActivateChild: [authGuard],   // proteger también los hijos
    children: [
      // agrega aquí más rutas protegidas por layout:
      { path: 'home', component: HomeComponent },
      { path: 'causantes', component: CausanteListComponent },
      { path: 'causantes/nuevo', component: CausanteCreateComponent },
      { path: 'causantes/:id/editar', component: CausanteEditComponent },
      // NUEVO: listado de beneficiarios para un causante
      {
        path: 'beneficiarios/:causanteId',
        loadComponent: () =>
          import('./pages/beneficiarios/beneficiarios-list/beneficiarios-list.component')
            .then(m => m.BeneficiariosListComponent)
      },

      // BENEFICIARIO NUEVO 
      {
        path: 'beneficiarios/:causanteId/nuevo',
        loadComponent: () =>
          import('./pages/beneficiarios/beneficiario-create/beneficiario-create.component')
            .then(m => m.BeneficiarioCreateComponent)
      },

      //Editar benef
      {
        path: 'beneficiarios/:causanteId/:bencod/editar',
        loadComponent: () =>
          import('./pages/beneficiarios/beneficiario-edit/beneficiario-edit.component')
            .then(m => m.BeneficiarioEditComponent)
      },

      // Nóminas
      { path: 'nominas', component: NominasListComponent },
      { path: 'nominas/nueva', component: NominaNewComponent },
      {
        path: 'nominas/:id',
        loadComponent: () =>
          import('./pages/nominas/nomina-detail/nomina-detail.component')
            .then(m => m.NominaDetailComponent)
      },
    ]
  },

  // catch-all redirejie direccionando a login
  { path: '**', redirectTo: 'login' }
];