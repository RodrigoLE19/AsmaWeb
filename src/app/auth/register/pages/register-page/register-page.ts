import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { firstValueFrom } from 'rxjs';


import Swal from 'sweetalert2';

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

  async registrarUsuario(): Promise<void> {

    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos no válidos',
        text: 'Por favor ingresa datos válidos.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const contrasena = this.registerForm.value.contrasena!;
    const confirmarContrasena = this.registerForm.value.confirmarContrasena!;

    if (contrasena !== confirmarContrasena) {
      Swal.fire({
        icon: 'warning',
        title: 'Las contraseñas no coinciden',
        text: 'Verifica que ambos contraseñas sean iguales.',
        confirmButtonText: 'Aceptar'
      });
      return;
      
    }

    this.isLoading = true;

    try {
      await firstValueFrom(
        this.authService.registrar({
          nombre: this.registerForm.value.nombre!,
          apellido: this.registerForm.value.apellido!,
          email: this.registerForm.value.email!,
          contrasena: contrasena
        })
      );

      Swal.fire({
          icon: 'success',
          title: 'Cuenta creada correctamente',
          text: 'Tu cuenta ha sido registrada. Ya puedes iniciar sesión.',
          confirmButtonText: 'Iniciar sesión'
      });

      this.router.navigate(['/login']);

    } catch (error: any) {
      console.log('Error al registrar: ', error);

      if (error.status === 409) {
        Swal.fire({
          icon: 'warning',
          title: 'Correo ya registrado',
          text: 'Este correo ya está en uso. Ingrese otro correo.',
          confirmButtonText: 'Aceptar'
      });
        
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Error al registrar',
          text: 'No se pudo crear la cuenta. Intentelo nuevamente.',
          confirmButtonText: 'Aceptar'
      });
      }
      
    } finally {
      this.isLoading = false;
    }

    
  }
}
