import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EvaluationDTO } from '../interfaces/EvaluationDTO';
import { EvaluationResultDTO } from '../interfaces/EvaluationResultDTO';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class EvaluationService {

  http=inject(HttpClient)

  evaluar (sintomas:any){
    return this.http.post<EvaluationResultDTO>(
      `${environment.modelUrl}/evaluation`, sintomas)
  }

  guardarEvaluacion(evaluacion: any) {
    return this.http.post(`${environment.apiUrl}/evaluaciones`, evaluacion);
  }

  obtenerEvaluaciones(idUsuario: number) {
    return this.http.get<EvaluationDTO[]>(
      `${environment.apiUrl}/usuarios/${idUsuario}/evaluaciones`);
  }

  
}
