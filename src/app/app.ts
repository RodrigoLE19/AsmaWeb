import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('proyect-angular');

  router = inject(Router);

  mostrarNavbar(): boolean {
    return ! (
      this.router.url.includes('/login') || 
      this.router.url.includes('/register'));
  }

  obtenerNombreUsuario(): string {
    const usuarioGuardado = localStorage.getItem('usuario');

    if (!usuarioGuardado) {
      return 'usuario';
      
    }

    const usuario = JSON.parse(usuarioGuardado);

    return usuario.nombre;
  }

  obtenerInicialUsuario(): string {
    const usuarioGuardado = localStorage.getItem('usuario');

    if (!usuarioGuardado) {
      return 'U';
    }

    const usuario = JSON.parse(usuarioGuardado);

    return usuario.nombre
      ? usuario.nombre.charAt(0).toUpperCase()
      : 'U';
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
