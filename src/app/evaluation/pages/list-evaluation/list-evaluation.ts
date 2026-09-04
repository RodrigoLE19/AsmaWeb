import { Component, inject, signal } from '@angular/core';
import { EvaluationService } from '../../services/evaluation-service';
import { EvaluationDTO } from '../../interfaces/EvaluationDTO';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-evaluation',
  imports: [RouterLink],
  templateUrl: './list-evaluation.html',
  styleUrl: './list-evaluation.css',
})
export class ListEvaluation {

  private evaluationService = inject(EvaluationService);

  evaluaciones = signal<EvaluationDTO[]>([]);

  textoBusqueda = signal<string>('');

  paginaActual = signal<number>(1);

  evaluacionesPorPagina = 5;

  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.obtenerEvaluaciones();
  }

  obtenerEvaluaciones(): void {
    this.isLoading.set(true);

    //USUAREMOS TEMPLORALMENTE EL USUARIO 1

    const idUsuario = 1;

    this.evaluationService.obtenerEvaluaciones(idUsuario).subscribe({
      next: (respuesta) => {
        console.log('Evaluaciones recibidas:', respuesta);
        this.evaluaciones.set(respuesta);
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Error al obtener las evaluaciones', error);
        this.isLoading.set(false);
      }
    });
  }

  evaluacionesFilstradas(): EvaluationDTO[] {
    const texto = this.textoBusqueda().toLowerCase().trim();

    if (!texto) {
      return this.evaluaciones();
    }

    return this.evaluaciones().filter(evaluacion => {
      const id = evaluacion.idEvaluacion.toString();
      const riesgo = evaluacion.resultado.toLowerCase();
      return id.includes(texto) || riesgo.includes(texto);
    });
  }

  evaluacionesPaginadas(): EvaluationDTO[] {
    const inicio = (this.paginaActual() - 1) * this.evaluacionesPorPagina;
    const fin = inicio + this.evaluacionesPorPagina;

    return this.evaluacionesFilstradas().slice(inicio, fin);
  }

  totalPaginas(): number {
    return Math.ceil(this.evaluacionesFilstradas().length / this.evaluacionesPorPagina);
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 1) {
      this.paginaActual.update(pagina => pagina -1);
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual() < this.totalPaginas()) {
      this.paginaActual.update(pagina => pagina + 1);
    }
  }

}
