import { Component, inject, signal } from '@angular/core';
import {ReactiveFormsModule, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { EvaluationService } from '../../services/evaluation-service';
import { firstValueFrom } from 'rxjs';
import { ServiceModal } from '../../shared/services/service-modal';
import { ModalRiskComponent } from '../../components/modal-risk-component/modal-risk-component';

@Component({
  selector: 'app-new-evaluation',
  imports: [ReactiveFormsModule],
  templateUrl: './new-evaluation.html',
  styleUrl: './new-evaluation.css',
})
export class NewEvaluation {

  public readonly isLoading = signal<boolean>(false)

  evaluationService = inject(EvaluationService)

  evaluationForm: FormGroup;
  imc: number | null = null;

  constructor(private fb: FormBuilder,  public evaluacionService: EvaluationService, public serviceModal: ServiceModal) {
    this.evaluationForm = this.fb.group({
      peso: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
        
      ],
      altura: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],
      dificultadRespirar: [null, Validators.required],
      tos: [null, Validators.required],
      silbidoPecho: [null, Validators.required],
      opresionPecho: [null, Validators.required]
    });
  }

  mostrarDatos(): void {
    console.log(this.evaluationForm.value);
  }

  calcularIMC(): void {
    const peso = this.evaluationForm.get('peso')?.value;
    const alturaCm = this.evaluationForm.get('altura')?.value;

    if (!peso || !alturaCm) {
      return;
    }

    const alturaMetros = alturaCm / 100;

    this.imc = Number(
      (peso / (alturaMetros * alturaMetros)).toFixed(2)
    );
  }

  seleccionarRespuesta(
    campo: string,
    respuesta: boolean
  ): void {
    this.evaluationForm.get(campo)?.setValue(respuesta);
  }

  async enviarEvaluacion() {
    if(this.evaluationForm.invalid) {
      this.evaluationForm.markAllAsTouched();
      return;
    }

    if(this.imc === null) {
      return;
    }
    const datosEvaluacion = {
      questionIMC: this.imc,
      questionWheezing: this.evaluationForm.value.silbidoPecho,
      questionShortnessOfBreath: this.evaluationForm.value.dificultadRespirar,
      questionChestTightness: this.evaluationForm.value.opresionPecho,
      questionCoughing: this.evaluationForm.value.tos
    };
    try{
      console.log('Datos enviados al modelo:', datosEvaluacion);

      const respuesta = await firstValueFrom(
        this.evaluacionService.evaluar(datosEvaluacion)
      ); 

      console.log('Respuesta del modelo:',respuesta);

      const resultado =
        respuesta.AsthmaDiagnosis === '[0]'
          ? 'Baja Probabilidad'
          : 'Alta Probabilidad';

      const ahora = new Date();

      const usuarioGuardado = localStorage.getItem('usuario');

      if (!usuarioGuardado) {
        console.error('No hay usuario autenticado');
        return; 
      }

      const usuario = JSON.parse(usuarioGuardado);
      
      const evaluacionGuardar = {
        fecha: ahora.toISOString().split('T')[0],
        hora: ahora.toTimeString().slice(0, 5),
        tiempoPrediccion: `${respuesta.prediction_time_ms} ms`,
        resultado,
        usuario: usuario.idUsuario
      };

      console.log('Evaluacion para guardar:', evaluacionGuardar);

      const evaluacionGuardada = await firstValueFrom(
        this.evaluacionService.guardarEvaluacion(evaluacionGuardar)
      );

      console.log('Evaluacion guardada:', evaluacionGuardada);

      this.serviceModal.openModal(ModalRiskComponent, respuesta)

    } catch (error)
     {
      console.log(error)

    }

    
  }

}
