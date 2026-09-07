import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';


@Component({
  selector: 'app-forgot-password-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password-page.html',
  styleUrl: './forgot-password-page.css',
})
export class ForgotPasswordPage {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoading = signal(false);
  mensajeExito = signal('');
  mensajeError = signal('');

  recuperarForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  enviarSolicitud(): void {

    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
      
    }

    this.isLoading.set(true);
    this.mensajeExito.set('');
    this.mensajeError.set('');

    const email = this.recuperarForm.value.email!;

    this.authService.recuperarContrasena(email)
      .subscribe({
        next: () => {
          this.mensajeExito.set('Te enviamos un enlace para restablecer tu cotnraseña');
          this.isLoading.set(false);
        },

        error: () => {
          this.mensajeError.set('No se pudo procesar la solicitud');
          this.isLoading.set(false);
        }
      });
  }

}
