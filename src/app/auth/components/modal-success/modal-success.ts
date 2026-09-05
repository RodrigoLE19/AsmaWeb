import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceModal } from '../../../evaluation/shared/services/service-modal';

@Component({
  selector: 'app-modal-success',
  imports: [],
  templateUrl: './modal-success.html',
  styleUrl: './modal-success.css',
})
export class ModalSuccess {
  matDialog = inject(MAT_DIALOG_DATA);
  modalService = inject(ServiceModal);

  get titulo(): string {
    return this.matDialog.data.titulo;
  }

  get mensaje(): string {
    return this.matDialog.data.mensaje;
  }
}
