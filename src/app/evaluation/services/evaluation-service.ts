import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EvaluationDTO } from '../interfaces/EvaluationDTO';
import { EvaluationResultDTO } from '../interfaces/EvaluationResultDTO';
import { environment } from '../../environments/environment';

export interface SolicitudEvaluation {
  peso: number;
  altura: number;
  dificultadRespirar: boolean;
  tos: boolean;
  silbidoPecho: boolean;
  opresionPecho: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {

  private http=inject(HttpClient)

  evaluar (datos:SolicitudEvaluation){
    return this.http.post<EvaluationResultDTO>(
      `${environment.apiUrl}/evaluaciones`, datos)
  }

  obtenerEvaluaciones(idUsuario: number) {
    return this.http.get<EvaluationDTO[]>(
      `${environment.apiUrl}/usuarios/${idUsuario}/evaluaciones`);
  }

  
}
