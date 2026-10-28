import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


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
  private route = inject(ActivatedRoute);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required]
  });

  registerForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contrasena: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],
    confirmarContrasena: ['', Validators.required]
  });

  isLoading = signal(false);
  mostrarContrasena = signal(false);

  mostrarContrasenaRegistro = signal(false);
  mostrarConfirmacion = signal(false);

  esRegistro = signal(this.route.snapshot.url[0]?.path === 'register');

  constructor() {
      this.route.url
          .pipe(takeUntilDestroyed())
          .subscribe(segmentos => {
              this.esRegistro.set(
                  segmentos[0]?.path === 'register'
              );
          });
  }

  toggleContrasena(): void {
    this.mostrarContrasena.update(valor => !valor);
  }

  toggleContrasenaRegistro(): void {
    this.mostrarContrasenaRegistro.update(valor => !valor);
  }

  toggleConfirmacion(): void {
    this.mostrarConfirmacion.update(valor => !valor);
  }

  cambiarVista():void {
    if (this.isLoading()) return;

    const destino = this.esRegistro()
        ? '/login'
        : '/register';

    void this.router.navigate([destino]);
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

      this.authService.guardarSesion(respuesta);

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

  async registrarUsuario(): Promise<void> {
      if (this.isLoading()) return;
  
      this.registerForm.markAllAsTouched();
  
      const valores = this.registerForm.getRawValue();
      const nombre = (valores.nombre ?? '').trim();
      const apellido = (valores.apellido ?? '').trim();
      const email = (valores.email ?? '').trim();
      const contrasena = valores.contrasena ?? '';
      const confirmarContrasena = valores.confirmarContrasena ?? '';
  
      this.registerForm.patchValue({ nombre, apellido, email });
  
      const campos = [
        { nombre: 'Nombre', valor: nombre },
        { nombre: 'Apellido', valor: apellido },
        { nombre: 'Correo', valor: email },
        { nombre: 'Contraseña', valor: contrasena },
        { nombre: 'Confirmar contraseña', valor: confirmarContrasena }
      ];
  
      const faltantes = campos
        .filter(campo => !campo.valor.trim())
        .map(campo => campo.nombre);
  
      if (faltantes.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: `Completa los siguientes campos: ${faltantes.join(', ')}.`,
          confirmButtonText: 'Aceptar'
        });
        return;
      }
  
  
      if (this.registerForm.controls.email.hasError('email')) {
        Swal.fire({
          icon: 'warning',
          title: 'Correo no válido',
          text: 'Ingrese un correo válido.',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
  
      if (contrasena.length < 8) {
        Swal.fire({
          icon: 'warning',
          title: 'Contraseña no válida',
          text: 'La contraseña debe tener al menos 8 caracteres.',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
  
      if (contrasena !== confirmarContrasena) {
        Swal.fire({
          icon: 'warning',
          title: 'Las contraseñas no coinciden',
          text: 'Verifica que ambas contraseñas sean iguales.',
          confirmButtonText: 'Aceptar'
        });
        return;
        
      }
  
      if (this.registerForm.invalid) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos no válidos',
          text: 'Por favor ingresa datos válidos.',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
  
      this.isLoading.set(true);
  
      try {
        await firstValueFrom(
          this.authService.registrar({
            nombre,
            apellido,
            email,
            contrasena
          })
        );
  
        Swal.fire({
            icon: 'success',
            title: 'Cuenta creada correctamente',
            text: 'Tu cuenta ha sido registrada. Ya puedes iniciar sesión.',
            confirmButtonText: 'Iniciar sesión'
        });
  
        this.registerForm.reset();
        await this.router.navigate(['/login']);
  
      } catch (error: any) {
        
        if (error.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Correo ya registrado',
            text: 'Este correo ya está en uso. Ingrese otro correo.',
            confirmButtonText: 'Aceptar'
        });
          
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: 'No se pudo crear la cuenta. Intentelo nuevamente.',
            confirmButtonText: 'Aceptar'
        });
        }
        
      } finally {
        this.isLoading.set(false);
      }
  
      
    }
}
