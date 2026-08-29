import { Component } from '@angular/core';
import {ReactiveFormsModule, FormGroup, FormBuilder} from '@angular/forms';

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
      peso: [''],
      altura: [''],
      dificultadRespirar: [null],
      tos: [null],
      silbidoPecho: [null],
      opresionPecho: [null]
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

  

}
