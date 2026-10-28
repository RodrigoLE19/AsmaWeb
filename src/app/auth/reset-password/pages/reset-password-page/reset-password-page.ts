import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-reset-password-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.css',
})
export class ResetPasswordPage {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  isLoading = signal(false);
  mensajeError = signal('');
  mensajeExito = signal('');
  mostrarNuevaContrasena = signal(false);
  mostrarConfirmacion = signal(false);

  token: string = '';

  resetForm = this.fb.group({
    nuevaContrasena: ['', [
      Validators.required,
      Validators.minLength(8)
    ]],
    confirmarContrasena: ['', [
      Validators.required
    ]]
  });

  constructor() {
    this.token = this.activatedRoute.snapshot.paramMap.get('token') ?? '';
  }

  restablecerContrasena(): void {
    if (this.isLoading() || this.mensajeExito()) {
      return;
    }

    this.mensajeError.set('');
    this.resetForm.markAllAsTouched();

    if (this.resetForm.invalid) {
      return;
    }

    const {
      nuevaContrasena,
      confirmarContrasena
    } = this.resetForm.getRawValue();

    if (nuevaContrasena !== confirmarContrasena) {
      this.mensajeError.set('Las contraseñas no coinciden.');
      return;
    }

    if (!this.token) {
      this.mensajeError.set('El enlace de recuperación no es válido.');
      return;
    }

    this.isLoading.set(true);

    this.authService
      .restablecerContrasena(this.token, nuevaContrasena!)
      .subscribe({
        next: () => {
          this.mensajeExito.set(
            'Contraseña actualizada. Te llevaremos al inicio de sesión.'
          );

          this.isLoading.set(false);

          setTimeout(() => {
            void this.router.navigate(['/login']);
          }, 2000);
        },

        error: (error) => {
          this.mensajeError.set(
            [400, 404, 410].includes(error.status)
              ? 'El enlace no es válido, ha expirado o los datos no son válidos.'
              : 'No se pudo actualizar la contraseña. Inténtalo nuevamente.'
          );

          this.isLoading.set(false);
        }
      });
  }

}
