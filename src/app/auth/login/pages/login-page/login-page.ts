import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required]
  });

  isLoading = signal(false);
  mensajeError = signal('');
  mensajeExito = signal('');
  nombreUsuario = '';
  mostrarContrasena = signal(false);

  toggleContrasena(): void {
    this.mostrarContrasena.update(valor => !valor);
  }

  async iniciarSesion(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.mensajeError.set('');
    this.mensajeExito.set('');
    

    try {
      const respuesta = await firstValueFrom(
        this.authService.login({
          email: this.loginForm.value.email!,
          contrasena: this.loginForm.value.contrasena!
        })
      );

      console.log('Usuario autenticado:', respuesta);

      localStorage.setItem(
        'usuario',
        JSON.stringify(respuesta)
      );

      this.nombreUsuario = respuesta.nombre;
      this.mensajeExito.set('Login exitoso');

      setTimeout(async () => {
        await this.router.navigate(['/list-evaluation']);
      }, 1500);

    } catch (error: any) {

      if (error.status === 401) {
        this.mensajeError.set('Correo o contraseña incorrectos.');
      } else {
        this.mensajeError.set('No se pudo inciar sesión');
      }
    } finally {
      this.isLoading.set(false);

    }
  }
}
