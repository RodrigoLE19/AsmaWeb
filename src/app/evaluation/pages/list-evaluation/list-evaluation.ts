import { Component, inject, signal } from '@angular/core';
import { EvaluationService } from '../../services/evaluation-service';
import { EvaluationDTO } from '../../interfaces/EvaluationDTO';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-list-evaluation',
  imports: [RouterLink],
  templateUrl: './list-evaluation.html',
  styleUrl: './list-evaluation.css',
})
export class ListEvaluation {

  private evaluationService = inject(EvaluationService);
  private authService = inject(AuthService);

  errorCarga = signal<string>('');

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
    this.errorCarga.set('');

    this.authService.obtenerPerfil().pipe(
      switchMap(perfil =>
        this.evaluationService.obtenerEvaluaciones(perfil.idUsuario)
      )
    ).subscribe({
      next: respuesta => {
        this.evaluaciones.set(respuesta);
        this.isLoading.set(false);
      },

      error: error => {
        this.isLoading.set(false);

        if (error.status !== 401) {
          this.errorCarga.set(
            'No se pudo cargar el historial. Inténtalo nuevamente.'
          );
        }
      }
    });
  }

  evaluacionesFiltradas(): EvaluationDTO[] {
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

    return this.evaluacionesFiltradas().slice(inicio, fin);
  }

  totalPaginas(): number {
    return Math.ceil(this.evaluacionesFiltradas().length / this.evaluacionesPorPagina);
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
