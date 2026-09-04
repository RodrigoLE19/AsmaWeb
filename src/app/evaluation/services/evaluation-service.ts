import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EvaluationDTO } from '../interfaces/EvaluationDTO';
import { EvaluationResultDTO } from '../interfaces/EvaluationResultDTO';



@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  http=inject(HttpClient)

  evaluar (sintomas:any){
    return this.http.post<EvaluationResultDTO>(
      'https://modelo-crisis-asmatica.onrender.com/evaluation', sintomas)
  }

  guardarEvaluacion(evaluacion: any) {
    return this.http.post('http://localhost:8080/evaluaciones', evaluacion);
  }

  obtenerEvaluaciones(idUsuario: number) {
    return this.http.get<EvaluationDTO[]>(
      `http://localhost:8080/usuarios/${idUsuario}/evaluaciones`);
  }

  
}
