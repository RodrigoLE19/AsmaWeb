import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';


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
  mostrarContrasena = signal(false);

  toggleContrasena(): void {
    this.mostrarContrasena.update(valor => !valor);
  }

  async iniciarSesion(): Promise<void> {
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos no válidos',
        text: 'Por favor complete correctamente todos los campos.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.isLoading.set(true);
    
    try {
      const respuesta = await firstValueFrom(
        this.authService.login({
          email: this.loginForm.value.email!,
          contrasena: this.loginForm.value.contrasena!
        })
      );

      localStorage.setItem(
        'usuario',
        JSON.stringify(respuesta)
      );

      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: `Bienvenido/a, ${respuesta.nombre}.`,
        confirmButtonText: 'Continuar'
      });

      await this.router.navigate(['/list-evaluation']);

    } catch (error: any) {

      if (error.status === 401) {
        Swal.fire({
          icon: 'warning',
          title: 'Credenciales incorrectas',
          text: 'El correo o la contraseña son incorrectos',
          confirmButtonText: 'Aceptar'
      });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: 'No se pudo iniciar sesión. Inténtalo nuevamente',
          confirmButtonText: 'Aceptar'
      });
      }
    } finally {
      this.isLoading.set(false);

    }
  }
}
