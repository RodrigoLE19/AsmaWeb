import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  http=inject(HttpClient)

  evaluar (sintomas:any){
    return this.http.post('https://modelo-crisis-asmatica.onrender.com/evaluation', sintomas)
  }
}
