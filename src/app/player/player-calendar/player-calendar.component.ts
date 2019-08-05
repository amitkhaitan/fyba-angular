import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlayerService } from './../player.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Form, FormArray, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { DataSharingService } from './../../data-sharing.service';

@Component({
  selector: 'app-player-calendar',
  templateUrl: './player-calendar.component.html',
  styleUrls: ['./player-calendar.component.css']
})
export class PlayerCalendarComponent implements OnInit {
  modalRef: BsModalRef;
  /**variable declaration start */

    dataRequest: boolean;
    initialFetchError = null;
    errorMsg: string;
    games:any;
    practices:any;
    other:any;
  /**variable declaration end */
  constructor(public modalService: BsModalService,
    public playerService: PlayerService,
    public dss: DataSharingService,
    public router: Router, 
    private fb: FormBuilder) { }

  ngOnInit() {
    this.dataRequest=true;
    if(this.dss.DivisionId){
      this.getplayerCalender();
    }

  }
  getplayerCalender(){
    this.playerService.getplayerCalender().subscribe((res) => {              
        var response = JSON.parse(res["_body"]); 
        //console.log(response); 
        this.dataRequest = false;          
        if(response.Status==true) {      
            this.playerService.calenderData =response.Value; 
            this.practices=this.playerService.calenderData.practices;
            this.games=this.playerService.calenderData.games;
            this.other=this.playerService.calenderData.other;            
        }else{
          this.modalRef = this.modalService.show(ErrorModalComponent);
          this.modalRef.content.closeBtnName = 'Close';
        }        
      }, (err) => {
        this.initialFetchError = true;
        this.errorMsg = err;
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = 'Close';
        this.modalRef.content.errorMsg = err;
      });
  }

    // get practices(){
    //   return this.playerService.calenderData.practices;
    // }

    // get games(){
    //   return this.playerService.calenderData.games;
    // }

    // get other(){
    //   return this.playerService.calenderData.other;
    // }
}
