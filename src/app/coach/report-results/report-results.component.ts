import { Component, Renderer2 } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { CoachService } from '../coach.service';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { DataSharingService } from './../../data-sharing.service';
import { APIGamePost } from './../models/coachReport.model';
import { SavedataPopupComponent } from 'src/app/official/report-game/savedata-popup/savedata-popup.component';
//import { SavedataPopupComponent } from './savedata-popup/savedata-popup.component';

@Component({
  selector: 'app-report-results',
  templateUrl: './report-results.component.html',
  styleUrls: ['./report-results.component.css']
})
export class ReportResultsComponent{
  coachReportData:APIGamePost = null;
  private readonly notifier: NotifierService;
  constructor(
    public router: Router,
    public coachService: CoachService,
    public renderer: Renderer2,
    public config: NgbAccordionConfig,
    private modalService: BsModalService,
    public dss: DataSharingService,
    public notifierService: NotifierService
  ) {
    this.notifier = notifierService;
    config.type = 'info';
    config.closeOthers = true;
  }

  newRequest: boolean = null;
  dataRequest:boolean;
  modalRef: BsModalRef;
  initialJson: string;
  errorMsg: string;
  initialFetchError = null;
 
  
  ngOnInit() {
    if(this.dss.TeamId){
      this.dataRequest=true;
    this.CoachReportGameData(); 
    }
       
  }

  async CoachReportGameData(){
    await this.coachService.getReportResultData().subscribe(
      (res)=>{
        var response=res;
          console.log(response);
            this.dataRequest=false;
         if(response.Status==true){
            this.coachReportData = response.Value;
        } else {
            this.modalRef = this.modalService.show(ErrorModalComponent);
            this.modalRef.content.closeBtnName = 'Close';
            this.dataRequest=false;
        }         
      }, (err) => {
            this.initialFetchError = true;
            this.dataRequest=false;
            //this.errorMsg = err;
            //this.modalRef = this.modalService.show(ErrorModalComponent);
            //this.modalRef.content.closeBtnName = 'Close';
            //this.modalRef.content.errorMsg = err;
      });
  }

 /* - On clicking save button, a message is shown to the user. 
  We hide the message if the user clicks on a new panel - */
  incidentCount = 0;
  panelChange($event: NgbPanelChangeEvent) {
    if (this.coachService.dataChanged == true) {
      $event.preventDefault();
      const initialState = {
        popupTitle: 'Save Data Before Exiting',
        popupMsg: 'Please save your previous game data else it will not be saved.'
      };

      const newPanelModal = this.modalService.show(
        SavedataPopupComponent,
        Object.assign({}, { class: 'customModalWidth75', initialState })
      );

      newPanelModal.content.saveStatus.subscribe(($e) => {
        if ($e == false) {  
          this.coachService.IncidentReports = [];
          this.coachService.NewIncidents = [];
          this.coachService.ModifiedIncidents = [];
          this.coachService.dataChanged = false;
          this.coachReportData = JSON.parse(this.coachService.initialJson);
        }
      });
    }
  }
 

}
