import { Component } from '@angular/core';
import {ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule} from '@angular/forms';
import { EvaluationService } from '../../services/evaluation-service';
import { firstValueFrom } from 'rxjs';
import { ServiceModal } from '../../shared/services/service-modal';
import { ModalRiskComponent } from '../../components/modal-risk-component/modal-risk-component';



@Component({
  selector: 'app-new-evaluation',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './new-evaluation.html',
  styleUrl: './new-evaluation.css',
})
export class NewEvaluation {

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
      console.log(datosEvaluacion);
    const respuesta = await firstValueFrom(this.evaluacionService.evaluar(datosEvaluacion)) 
    console.log(respuesta)

    this.serviceModal.openModal(ModalRiskComponent, respuesta)

    } catch (error)
     {
      console.log(error)

    }

    
  }

}
