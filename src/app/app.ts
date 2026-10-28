import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { AuthService } from './auth/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('proyect-angular');

  private authService = inject(AuthService);
  router = inject(Router);

  mostrarNavbar(): boolean {
    return this.router.navigated && !(
      this.router.url.includes('/login') || 
      this.router.url.includes('/register') ||
      this.router.url.includes('/forgot-password') ||
      this.router.url.includes('/reset-password'));
  }

  obtenerNombreUsuario(): string {
    return this.authService.perfil()?.nombre || 'Usuario';
  }

  obtenerInicialUsuario(): string {
    return this.obtenerNombreUsuario().charAt(0).toUpperCase();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    void this.router.navigate(['/login']);
  }
}
