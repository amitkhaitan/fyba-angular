import { Component, OnInit } from '@angular/core';
import { DataSharingService } from './../../data-sharing.service';
import { CoachService }  from './../coach.service';
import { Router } from '@angular/router';
import { CoachTeamSection } from './../models/coachteam.model';
import { FormBuilder,FormArray,FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-coachteam',
  templateUrl: './coachteam.component.html',
  styleUrls: ['./coachteam.component.css']
})
export class CoachteamComponent{
  modalRef: BsModalRef;
  profileData: CoachTeamSection = null;
  /**variable declaration start */

    dataRequest: boolean;
    showHealthCondition:boolean;
    showteamleadership:boolean;
    showTeamRoaster:boolean;
    sendBlastDisable:boolean;
    initialFetchError = null;
    errorMsg: string;
    TeamName:string;
    Emailsrc:string;
    Smssrc:string;
    TeamLeaders:Array<string>;
    TeamRoster:Array<string>;
    HealthConditions:Array<string>;
    
  /**variable declaration end */

  constructor(public router: Router,
    public config: NgbAccordionConfig,
    private modalService: BsModalService,
    private coachService: CoachService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.dataRequest=true;
    this.showHealthCondition=true;
    this.showteamleadership=true;
    this.showTeamRoaster=true;
    this.Emailsrc="./assets/images/mail-icon.png";
    this.Smssrc="./assets/images/sms-icon.png";
    this.coachTeamInfo();
    //this.getallemail();

  }

coachTeamInfo(){
    this.coachService.getcoachTeamInfoData().subscribe((res) => {   
      this.dataRequest = false;   
      var response = res; 
      console.log(response);    
      if (response.Status==true) {      
        this.coachService.teamInfoData =response.Value; 
        this.TeamName=this.coachService.teamInfoData.TeamName;
        this.TeamRoster=this.coachService.teamInfoData.TeamRoster;
          if(this.coachService.teamInfoData.TeamLeaders.length>0){
                this.TeamLeaders=this.coachService.teamInfoData.TeamLeaders;
          }else{
                this.showteamleadership=false;
          } 
          if(this.coachService.teamInfoData.TeamRoster.length>0){
                this.TeamRoster=this.coachService.teamInfoData.TeamRoster;
                
          }else{
                this.sendBlastDisable=true;
                this.showTeamRoaster=false;
          }        
          if(this.coachService.teamInfoData.HealthConditions.length>0){
                this.HealthConditions=this.coachService.teamInfoData.HealthConditions; 
          }else{
                this.showHealthCondition=false;
          }       
      } else {
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = 'Close';
        this.showteamleadership=false;
        this.showTeamRoaster=false;
        this.showHealthCondition=false;
        this.sendBlastDisable=true;
      }         
    }, (err) => {
      this.initialFetchError = true;
      this.errorMsg = err;
      this.modalRef = this.modalService.show(ErrorModalComponent);
      this.modalRef.content.closeBtnName = 'Close';
      this.modalRef.content.errorMsg = err;
    });
  }

  sendEmail(type){
      this.getallemail();
      //console.log( this.coachService.recepientemail);
      //console.log(this.coachService.recepientemailId);
      //console.log(this.coachService.recepientmobileno);
       this.router.navigate(["/coach/blastemail",{blasttype:type}]);
    
  }

async getallemail(){
  this.coachService.recepientemail='';
  this.coachService.recepientemailId='';
  this.coachService.recepientmobileno='';
    if(this.TeamRoster!=null){
      if (this.TeamRoster.length>0){
        for (let i = 0; i < this.TeamRoster.length;i++) {
          var playerparents=this.TeamRoster[i]['Parents'];
           if(playerparents.length>0){
             for(let j=0; j<playerparents.length;j++){             
                this.coachService.recepientemail += playerparents[j]['ParentEmail'] + ',';
                this.coachService.recepientemailId += playerparents[j]['ParentId'] + ',';
                this.coachService.recepientmobileno += playerparents[j]['ParentMobilePhone'] + ',';
             }
           }
        }
      }
    }    
  }
   
}
