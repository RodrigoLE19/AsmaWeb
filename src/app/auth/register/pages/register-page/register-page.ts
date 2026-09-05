import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { firstValueFrom } from 'rxjs';
import { ServiceModal } from '../../../../evaluation/shared/services/service-modal';
import { ModalSuccess } from '../../../components/modal-success/modal-success';


@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private modalService = inject(ServiceModal);

  registerForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', Validators.required],
    contrasena: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],
    confirmarContrasena: ['', Validators.required],
    terminos: [false, Validators.requiredTrue]
  });

  isLoading = false;
  mensajeError = '';

  async registrarUsuario(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const contrasena = this.registerForm.value.contrasena!;
    const confirmarContrasena = this.registerForm.value.confirmarContrasena!;

    if (contrasena !== confirmarContrasena) {
      this.mensajeError = 'Las contraseñan no coinciden';
      return;
      
    }

    this.isLoading = true;
    this.mensajeError = '';


    try {
      await firstValueFrom(
        this.authService.registrar({
          nombre: this.registerForm.value.nombre!,
          apellido: this.registerForm.value.apellido!,
          email: this.registerForm.value.email!,
          contrasena: contrasena
        })
      );

      this.modalService.openModal(
      ModalSuccess,
      {
        titulo: 'Cuenta creada correctamente',
        mensaje: 'Tu cuenta ha sido registrada. Ya puedes inciair sesión'
      }
    );

    } catch (error: any) {
      if (error.status === 409) {
        this.mensajeError = 'El correo ya esta registrado';
        
      } else {
        this.mensajeError = 'No se pudo crear la cuenta';
      }
      
    } finally {
      this.isLoading = false;
    }

    
  }
}
