import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceModal } from '../../shared/services/service-modal';

@Component({
  selector: 'app-modal-risk-component',
  imports: [],
  templateUrl: './modal-risk-component.html',
  styleUrl: './modal-risk-component.css',
})
export class ModalRiskComponent {
  matDialog = inject(MAT_DIALOG_DATA)

  modalService = inject(ServiceModal)

  getMessageRisk(): string{
    if (this.matDialog.data.AsthmaDiagnosis == "[0]") {
      return "Mantén tu estilo de vida saludable y realiza controles periódicos"
    }
    
    return "Consulta con un especialista para un examen completo"
  }

  constructor(){
    console.log("MODAL ABIERTO");
    console.log(this.matDialog);
    console.log(this.matDialog.data);    
  }
}
