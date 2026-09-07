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

  token: string = '';

  resetForm = this.fb.group({
    nuevaContrasena: ['', [
      Validators.required,
      Validators.minLength(6)
    ]],
    confirmarContrasena: ['', [
      Validators.required
    ]]
  });

  constructor() {
    this.token = this.activatedRoute.snapshot.paramMap.get('token') ?? '';
  }

  restablecerContrasena(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
      
    }

    const nuevaContrasena = this.resetForm.value.nuevaContrasena!;
    const confirmarContrasena = this.resetForm.value.confirmarContrasena!;

    if (!this.token) {
      this.mensajeError.set('EL enlace de recuperacion no es válido');
      return;
      
    }

    this.isLoading.set(true);
    this.mensajeError.set('');
    this.mensajeExito.set('');

    this.authService
      .restablecerContrasena(this.token, nuevaContrasena)
      .subscribe({
        next: () => {
          this.mensajeExito.set('Tu contraseña fue restablecida correctamente');
          this.isLoading.set(false);

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },

        error: (error) => {
          console.error(error);
          this.mensajeError.set('El enlace es inválido o ha expirado');
          this.isLoading.set(false);
        }
      });
  }

}
