import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  fechaActual: Date = new Date();

  ngOnInit() {
    setInterval(() => {
      this.fechaActual = new Date();
    }, 1000);
  }
}


