import { Component, inject, signal } from '@angular/core';
import {ReactiveFormsModule, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { EvaluationService } from '../../services/evaluation-service';
import { firstValueFrom } from 'rxjs';
import { ServiceModal } from '../../shared/services/service-modal';
import { ModalRiskComponent } from '../../components/modal-risk-component/modal-risk-component';
import { ModalEvaluationInfo } from '../../components/modal-evaluation-info/modal-evaluation-info';

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

  evaluationService = inject(EvaluationService)

  evaluationForm: FormGroup;
  imc: number | null = null;

  constructor(private fb: FormBuilder,  public evaluacionService: EvaluationService, public serviceModal: ServiceModal) {
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
    const usuarioGuardado = localStorage.getItem('usuario');

    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      this.nombreUsuario = usuario.nombre;
    }
    this.serviceModal.openModal(ModalEvaluationInfo);
  }

  mostrarDatos(): void {
    console.log(this.evaluationForm.value);
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

    if(this.evaluationForm.invalid) {
      this.evaluationForm.markAllAsTouched();
      this.mensajeError.set('Complete correctamente todas las preguntas');
      return;
    }

    if(this.imc === null) {
      this.mensajeError.set('Debes calcular el IMC antes de enviar la evaluación');
      return;
    }

    this.isLoading.set(true);

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
      console.error('Error al procesar la evaluación', error);
      this.mensajeError.set('No se pudo procesar la evaluación. Inteéntalo nuevamente');
    } finally {
      this.isLoading.set(false);
    }    
  }
}
