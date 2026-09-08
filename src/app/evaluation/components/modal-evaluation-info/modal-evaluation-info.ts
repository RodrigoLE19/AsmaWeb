import { Component, inject } from '@angular/core';
import { ServiceModal } from '../../shared/services/service-modal';

@Component({
  selector: 'app-modal-evaluation-info',
  imports: [],
  templateUrl: './modal-evaluation-info.html',
  styleUrl: './modal-evaluation-info.css',
})
export class ModalEvaluationInfo {
  private serviceModal = inject(ServiceModal);

  cerrarModal(): void {
    this.serviceModal.closeModal(null);
  }
}
