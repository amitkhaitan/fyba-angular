import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlayerService } from './../player.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Form, FormArray, Validators, FormControl } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { DataSharingService } from './../../data-sharing.service';
import { MatSnackBar } from '@angular/material';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
//import { RequestStatusPopupComponent } from './../../common/request-status-popup/request-status-popup.component';
// import { format } from 'path';
// import { Observable, of, interval, Subscription, timer, pipe } from 'rxjs';
// import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css']
})


export class PlayerProfileComponent implements OnInit {
  @ViewChild('Apparel1') Apparel1: ElementRef;
  @ViewChild('Apparel2') Apparel2: ElementRef;


  fetchingData: boolean;
  profileForm;

  dropdownList = [];
  dropdownSettings = {};
  numbers1 = [];
  numbers2 = [];
  img1: string;
  img2: string;
  currentSrc1: string;
  currentSrc2: string;
  shortsizeSrc: string;
  jersysizeSrc: string;
  disableRequestjersy1:boolean;
  disableRequestjersy2:boolean;
  disableRequestshortsize:boolean;
  disableRequestjersysize:boolean;
  settings = {};
  selectedItems = [];




  constructor(public playerService: PlayerService,
    public router: Router, private fb: FormBuilder,
    private modalService: BsModalService,
    private config: NgbAccordionConfig,
    private snackbar: MatSnackBar) {
    config.closeOthers = true;
    this.img1 = "./assets/images/lock.png",
    this.img2 = "./assets/images/unlock.png"
    this.currentSrc1 = this.img1;
    this.currentSrc2 = this.img1;

    for (var i = 1; i <= 100; i++) {
      this.numbers1[i] = i;
      this.numbers2[i] = i;
    }

  }

  initProfileDetailsArray() {
    const formArr = new FormArray([]);

    for (var i in this.parentInfo) {
      formArr.push(
        this.fb.group({
          userId: this.parentInfo[i]["UserId"],
          parentName: this.parentInfo[i]["Parent_Name"],
          relationship: this.parentInfo[i]["Parent_Relationship"],
          email: new FormControl(this.parentInfo[i]["Parent_Email"], [Validators.email, Validators.required]),
          homePhone: new FormControl(this.parentInfo[i]["Parent_HomePhone"], [Validators.pattern(/^[- +()]*[0-9][- +()0-9]*$/), Validators.minLength(7), Validators.maxLength(14)]),
          mobilePhone: new FormControl(this.parentInfo[i]["Parent_MobilePhone"], [Validators.pattern(/^[- +()]*[0-9][- +()0-9]*$/), Validators.minLength(7), Validators.maxLength(14)]),
          textingoption:[],
          VolunteerCheckIn:this.parentInfo[i]["VolunteerCheckIn"],
          Parent_VolunteerPosition: this.parentInfo[i]["volunteerPosition"]["Parent_VolunteerPosition"]
        })
      )
    }
    return formArr;
  }


  get profileSection() {
    return this.playerService.profileData;
  }


  get parentInfo() {
    return this.profileSection.Value.parentInfo;
  }

  get registrationStatus() {
    return this.profileSection.Value.registrationStatus;
  }

  get transactionHistory() {
    return this.profileSection.Value.transactionHistory;
  }

  get apparel() {
    return this.profileSection.Value.apparel;
  }
  
  get playerInfo() {
    return this.profileSection.Value.playerInfo;
  }
  
  get textingoption(){
    return this.profileSection.Value.textingOption;
  }
  get ShirtSizeValue(){
    return this.profileSection.Value.ShirtSizeValue;
  }

  subscription;
  timesRun;
  interval;
  modalRef: BsModalRef;

  ngOnInit() {
    this.settings = {
      text: 'Select....',
      classes: 'myclass custom-class'
    };
    this.selectedItems=[{id: 1, itemName: "Urgent notices"},{id: 2, itemName: "Game reminders"}];
   
    this.fetchingData = true;
    this.disableRequestjersy1=true;
    this.disableRequestjersy2=true;
    this.interval = setInterval(() => {
      this.timesRun += 1;
      if (this.playerService.profileData) {
        this.profileForm = this.fb.group({
          ParentInfo: this.initProfileDetailsArray()
        });
        if (this.playerService.profileData.Value.apparel) {
          if(this.playerService.profileData.Value.apparel.RequestedJersey1Lock==true){
            this.currentSrc1 = this.img1;
            this.disableRequestjersy1=true;
            if(this.playerService.profileData.Value.apparel.RequestedJersey1==''){
              this.numbers1[0] = 'N/A';
            }
          }else{
            this.currentSrc1 = this.img2;
            this.disableRequestjersy1=false;
            if(this.playerService.profileData.Value.apparel.RequestedJersey1==''){
              this.numbers1[0] = 'Select..';
            }
          }
          if(this.playerService.profileData.Value.apparel.RequestedJersey2Lock==true){
            this.currentSrc2 = this.img1;
            this.disableRequestjersy2=true;
            if(this.playerService.profileData.Value.apparel.RequestedJersey2==''){
              this.numbers2[0] = 'N/A';
            }
          }else{
            this.currentSrc2 = this.img2;
            this.disableRequestjersy2=false;
            if(this.playerService.profileData.Value.apparel.RequestedJersey2==''){
              this.numbers2[0] = 'Select..';
            }
          }

          if(this.playerService.profileData.Value.apparel.ShortSizeLock==true){
            this.shortsizeSrc=this.img1;
            this.disableRequestshortsize=true;
          }else{
            this.shortsizeSrc=this.img2;
            this.disableRequestshortsize=false;
          }
          if(this.playerService.profileData.Value.apparel.JerseySizeLock==true){
            this.jersysizeSrc=this.img1;
            this.disableRequestjersysize=true;
          }else{
            this.jersysizeSrc=this.img2;
            this.disableRequestjersysize=false;
          }

      }
        clearInterval(this.interval);
        this.fetchingData = false;
      }
      

    }, 2000);

    //this.fetchingData=true;

    // this.playerService.getPlayerProfile()
    // .subscribe(
    //   (res)=>{
    //     this.profileSection=JSON.parse(res["_body"]);
    //     console.log(this.profileSection);
    //     this.fetchingData=false;
    //   }
    // )

    // this.dropdownList = [
    //   { "id": 1, "itemName": "Email" },
    //   { "id": 2, "itemName": "Home Phone" },
    //   { "id": 3, "itemName": "Mobile Phone" },
    // ];

    
  }


  validEmail: boolean;

  onChange(newValue) {
    const validEmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (validEmailRegEx.test(newValue)) {
      this.validEmail = true;
    } else {
      this.validEmail = false;
    }

  }

  // toggle() {

  //   if (this.Apparel1.nativeElement.firstElementChild.disabled) {
  //     this.Apparel1.nativeElement.firstElementChild.disabled = false;
  //   }
  //   else {
  //     this.Apparel1.nativeElement.firstElementChild.disabled = true;
  //   }
    
  //   if (this.Apparel2.nativeElement.firstElementChild.disabled) {
  //     this.Apparel2.nativeElement.firstElementChild.disabled = false;
  //   }
  //   else {
  //     this.Apparel2.nativeElement.firstElementChild.disabled = true;
  //   }

  //   this.currentSrc = (this.currentSrc == this.img1) ? this.img2 : this.img1;
  // }



  onSubmit() {
    this.fetchingData = true;
    var rd = "[";
    (<FormArray>this.profileForm.get('ParentInfo')).controls.forEach((group) => {
      rd += JSON.stringify({
        UserId: group.value.userId,
        Parent_HomePhone: group.value.homePhone,
        Parent_MobilePhone: group.value.mobilePhone,
        //Parent_WorkPhone: group.value.workPhone,
        Parent_Email: group.value.email
      }) + ","
    });
    rd = rd.substring(0, rd.length - 1);
    rd += "]"

    //console.log(JSON.stringify(rd));
    this.playerService.saveProfileData(rd)
      .subscribe((res) => {
        res = JSON.parse(res["_body"]);
        this.fetchingData = false;
        this.snackbar.open(res.Message.PopupHeading, '', { duration: 3000 });        
      });
  }

  modalRed: BsModalRef;
  withdraw(playerId: number, status: JSON) {
    this.modalRef = this.modalService.show(WithdrawComponent);
    this.modalRef.content.playerId = playerId;
    this.modalRef.content.details = status;

    // this.modalRef.content.status = responseBody.Status;
    // this.modalRef.content.popupTitle = responseBody.Message.PopupHeading;
    // this.modalRef.content.popupMsg = responseBody.Message.PopupMessage;
    // this.modalRef.content.route = "/player/team";
  }




}

