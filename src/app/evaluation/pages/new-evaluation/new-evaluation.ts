import { Component } from '@angular/core';
import {ReactiveFormsModule, FormGroup, FormBuilder, Validators} from '@angular/forms';


@Component({
  selector: 'app-new-evaluation',
  imports: [ReactiveFormsModule],
  templateUrl: './new-evaluation.html',
  styleUrl: './new-evaluation.css',
})
export class NewEvaluation {

  evaluationForm: FormGroup;
  imc: number | null = null;

  constructor(private fb: FormBuilder) {
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

  enviarEvaluacion(): void {
    if(this.evaluationForm.invalid) {
      return;
    }

    if(this.imc === null) {
      return;
    }

    

    const datosEvaluacion = {
      peso: this.evaluationForm.value.peso,
      altura: this.evaluationForm.value.altura,
      imc: this.imc,
      dificultadRespirar: this.evaluationForm.value.dificultadRespirar,
      tos: this.evaluationForm.value.tos,
      silbidoPecho: this.evaluationForm.value.silbidoPecho,
      opresionPecho: this.evaluationForm.value.opresionPecho
    };

    console.log(datosEvaluacion);
  }

}
