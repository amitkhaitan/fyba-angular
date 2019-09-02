import { Component, OnInit } from '@angular/core';
import { DataSharingService } from './../../data-sharing.service';
import { CoachService }  from './../coach.service';
import { Router } from '@angular/router';
import { CoachProfileResponse } from './../models/profileResponse.model';
import { FormBuilder,FormArray,FormControl, FormGroup } from '@angular/forms';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
@Component({
  selector: 'app-coach-calendar',
  templateUrl: './coach-calendar.component.html',
  styleUrls: ['./coach-calendar.component.css']
})
export class CoachCalendarComponent implements OnInit {
  modalRef: BsModalRef;

  /**variable declaration start */

    dataRequest: boolean;
    showpractices:boolean;
    showgames:boolean;
    showother:boolean;
    initialFetchError = null;
    errorMsg: string;
    games:any;
    practices:any;
    other:any;
  /**variable declaration end */

  constructor(public dss: DataSharingService, 
    private coachService: CoachService,
    private router: Router,
    private config: NgbAccordionConfig,
    private fb: FormBuilder,
    public modalService: BsModalService) { }

  ngOnInit() {
    this.dataRequest=true;
    this.showpractices=true;
    this.showgames=true;
    this.showother=true;
    this.coachCalender();

  }
  coachCalender(){
    
    this.coachService.getcoachCalenderData().subscribe((res) => {    
      this.dataRequest = false;   
      var response = res; 
      console.log(response);    
      if (response.Status==true) {      
        this.coachService.calenderData =response.Value;
          if(this.coachService.calenderData.practices.length>0){
            this.practices=this.coachService.calenderData.practices;
          }else{
            this.showpractices=false;
          }
          if(this.coachService.calenderData.games.length>0){
            this.games=this.coachService.calenderData.games;
          }else{
            this.showgames=false;
          }  
          if(this.coachService.calenderData.other.length>0){
            this.other=this.coachService.calenderData.other;
          }else{
            this.showother=false;
          }  
      } else {
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = 'Close';
        this.showpractices=false;
        this.showgames=false;
        this.showother=false;
      }         
    }, (err) => {
      this.initialFetchError = true;
      this.errorMsg = err;
      this.modalRef = this.modalService.show(ErrorModalComponent);
      this.modalRef.content.closeBtnName = 'Close';
      this.modalRef.content.errorMsg = err;
      this.showpractices=false;
      this.showgames=false;
      this.showother=false;
    });
  }
}
