import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = false;

  pmOpen = false; // se abrirá/cerrará automáticamente

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Evaluar la URL actual al cargar
    this.checkRoute(this.router.url);

    // Re-evaluar en cada navegación
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.checkRoute(e.urlAfterRedirects));
  }

  togglePm() {
    this.pmOpen = !this.pmOpen;
  }

  private checkRoute(url: string) {
    this.pmOpen =
      url.startsWith('/causantes') ||
      url.startsWith('/reportes')  ||
      url.startsWith('/borrador-nomina'); // agrega aquí más rutas del grupo si sumas
  }
}
