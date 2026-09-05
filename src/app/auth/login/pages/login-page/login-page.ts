import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
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

  isLoading = false;
  mensajeError = '';

  async iniciarSesion(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.mensajeError = '';

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

      await this.router.navigate(['/list-evaluation']);

    } catch (error: any) {
      if (error.status === 401) {
        this.mensajeError = 'Correo o contraseña incorrectos.'
      } else {
        this.mensajeError = 'No se pudo inciar sesión';
      }
      
    } finally {
      this.isLoading = false;
    }
  }
}
