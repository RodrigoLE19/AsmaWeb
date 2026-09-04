import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceModal } from '../../shared/services/service-modal';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-modal-risk-component',
  imports: [RouterLink],
  templateUrl: './modal-risk-component.html',
  styleUrl: './modal-risk-component.css',
})
export class ModalRiskComponent {
  matDialog = inject(MAT_DIALOG_DATA);

  modalService = inject(ServiceModal);

  getRiskTitle(): string {
    if(this.matDialog.data.AsthmaDiagnosis === '[0]') {
      return 'Baja Probabilidad';
    }

    return 'Alta Probabilidad';
  }

  getMessageRisk(): string{
    if (this.matDialog.data.AsthmaDiagnosis == "[0]") {
      return "Su evaluación indica una baja probabilidad de crisis asmatica."
    }
    
    return "Su evaluación indica una alta probabilidad de crisis asmatica."
  }

  constructor(){
    console.log("MODAL ABIERTO");
    console.log(this.matDialog);
    console.log(this.matDialog.data);    
  }
}
