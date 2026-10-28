import { Component, signal } from '@angular/core';
import {ReactiveFormsModule, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { EvaluationService } from '../../services/evaluation-service';
import { firstValueFrom } from 'rxjs';
import { ServiceModal } from '../../shared/services/service-modal';
import { ModalRiskComponent } from '../../components/modal-risk-component/modal-risk-component';
import { ModalEvaluationInfo } from '../../components/modal-evaluation-info/modal-evaluation-info';
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  selector: 'app-new-evaluation',
  imports: [ReactiveFormsModule],
  templateUrl: './new-evaluation.html',
  styleUrl: './new-evaluation.css',
})
export class NewEvaluation {

  public readonly isLoading = signal<boolean>(false)
  public  readonly mensajeError = signal<string>('');

  nombreUsuario: string = '';

  evaluationForm: FormGroup;
  imc: number | null = null;

  constructor(
    private fb: FormBuilder,  
    public evaluacionService: EvaluationService, 
    public serviceModal: ServiceModal,
    private authService: AuthService) {
    this.evaluationForm = this.fb.group({
      peso: [
        '',
        [
          Validators.required,
          Validators.min(20),
          Validators.max(300)
        ]
        
      ],
      altura: [
        '',
        [
          Validators.required,
          Validators.min(80),
          Validators.max(250)
        ]
      ],
      dificultadRespirar: [null, Validators.required],
      tos: [null, Validators.required],
      silbidoPecho: [null, Validators.required],
      opresionPecho: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.nombreUsuario = this.authService.perfil()?.nombre ?? '';

    this.authService.obtenerPerfil().subscribe({
      next: perfil => {
        this.nombreUsuario = perfil.nombre;
      },
      error: () => {
        
      }
    });
    this.serviceModal.openModal(ModalEvaluationInfo);
  }

  calcularIMC(): void {
    const pesoC0ntrol = this.evaluationForm.get('peso');
    const alturaControl = this.evaluationForm.get('altura');

    pesoC0ntrol?.markAllAsTouched();
    alturaControl?.markAllAsTouched();

    if (pesoC0ntrol?.invalid || alturaControl?.invalid) {
      this.imc = null;
      return;
    }

    const peso = pesoC0ntrol?.value;
    const alturaCm = alturaControl?.value;

    const alturaMetros = alturaCm / 100;

    this.imc = Number(
      (peso / (alturaMetros * alturaMetros)).toFixed(2)
    );
    this.mensajeError.set('');
  }

  seleccionarRespuesta(
    campo: string,
    respuesta: boolean
  ): void {
    this.evaluationForm.get(campo)?.setValue(respuesta);
  }

  async enviarEvaluacion() {

      if (this.isLoading()) {
        return;
      }

      this.mensajeError.set('');

      if (this.evaluationForm.invalid) {
        this.evaluationForm.markAllAsTouched();
        this.mensajeError.set(
          'Completa correctamente todas las preguntas'
        );
        return;
      }

      if (this.imc === null) {
        this.mensajeError.set(
          'Debes calcular el IMC antes de enviar la evaluación'
        );
        return;
      }

      const valores = this.evaluationForm.getRawValue();

      const datosEvaluacion = {
        peso: Number(valores.peso),
        altura: Number(valores.altura),
        dificultadRespirar: valores.dificultadRespirar as boolean,
        tos: valores.tos as boolean,
        silbidoPecho: valores.silbidoPecho as boolean,
        opresionPecho: valores.opresionPecho as boolean
      };

      this.isLoading.set(true);

      try {
        const respuesta = await firstValueFrom(
          this.evaluacionService.evaluar(datosEvaluacion)
        );

        this.serviceModal.openModal(
          ModalRiskComponent,
          respuesta
        );
      } catch (error) {
        console.error('Error al procesar la evaluación', error);

        this.mensajeError.set(
          'No se pudo procesar la evaluación. Inténtalo nuevamente'
        );
      } finally {
        this.isLoading.set(false);
      }
  }
}
