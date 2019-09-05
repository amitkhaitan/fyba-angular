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
import { throttleTime } from 'rxjs/operators';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { SuccessPopupComponent } from './../../official/report-game/success-popup/success-popup.component';
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
  settings = {};
  selectedItems = [];
  subscription;
  timesRun;
  interval;
  bsModalRef: BsModalRef;

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
    var defaultValue = 0;
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
          textingoption: new FormControl(this.textingoptionArray(this.parentInfo[i]["textingOption"])),
          VolunteerCheckIn:new FormControl(this.parentInfo[i]["VolunteerCheckIn"]),
          Parent_VolunteerPosition: new FormControl(this.parentInfo[i]["volunteerPosition"]["Parent_VolunteerPosition"])
        })
      )
    }
    return formArr;
  }

  textingoptionArray(parentvalue:any){    
    if(parentvalue!=null){
      let y;
      let option=[];
      y = parentvalue.split(',');
      for (let i = 0; i < y.length; i++) {
        this.textingoption.forEach((element) => {
          if (element.id == y[i]) {         
            option.push(element);            
          }
        });
      }
      return option;  
    }

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
  get JerseySizeValue(){
    return this.profileSection.Value.JerseySizeValue;
  }

  showApparel:boolean;
  showTransaction:boolean;
  showRegistration:boolean;
  showParentInfo:boolean;

  ngOnInit() {
    this.settings = {
      text: 'Select....',
      classes: 'myclass custom-class'
    };   
    this.fetchingData = true;
    this.interval = setInterval(() => {
      this.timesRun += 1;
      if (this.playerService.profileData) {        
        if (this.playerService.profileData.Value.apparel) {
          if(this.playerService.profileData.Value.apparel.RequestedJersey1Lock==true){
            this.currentSrc1 = this.img2;
          }else{
            this.currentSrc1 = this.img1;
          }
          if(this.playerService.profileData.Value.apparel.RequestedJersey2Lock==true){
            this.currentSrc2 = this.img2;
          }else{
            this.currentSrc2 = this.img1;
          }

          if(this.playerService.profileData.Value.apparel.ShortSizeLock==true){
            this.shortsizeSrc=this.img2;
          }else{
            this.shortsizeSrc=this.img1;
          }
          if(this.playerService.profileData.Value.apparel.JerseySizeLock==true){
            this.jersysizeSrc=this.img2;
          }else{
            this.jersysizeSrc=this.img1;
            
          }
          
          this.profileForm = this.fb.group({
            ParentInfo: this.initProfileDetailsArray(),        
            AssignedJersey:new FormControl({value:this.apparel.AssignedJersey}),
            JerseySizeId:new FormControl({value:this.apparel.JerseySizeId,disabled:(this.apparel.JerseySizeLock)==true ? false :true}),
            RequestedJersey1Id:new FormControl({value:this.apparel.RequestedJersey1Id,disabled:(this.apparel.RequestedJersey1Lock)==true ? false :true}),
            RequestedJersey2Id:new FormControl({value:this.apparel.RequestedJersey2Id,disabled:(this.apparel.RequestedJersey2Lock)==true ? false :true}),
            ShortSizeId:new FormControl({value:this.apparel.ShortSizeId,disabled:(this.apparel.ShortSizeLock)==true ? false :true}),
            AssignedJerseyLock: this.apparel.AssignedJerseyLock,
            JerseySizeLock:this.apparel.JerseySizeLock,
            RequestedJersey1Lock:this.apparel.RequestedJersey1Lock,
            RequestedJersey2Lock:this.apparel.RequestedJersey2Lock,
            ShortSizeLock:this.apparel.ShortSizeLock,

          });
                   
      }
        clearInterval(this.interval);
        this.fetchingData = false;
      }
      
    }, 2000);
  
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
   
  getparentinfo(){
    var player_parent = [];
    (<FormArray>this.profileForm.get('ParentInfo')).controls.forEach((group) => {
        var rd = {
          UserId : group.value.userId,
          Parent_HomePhone : group.value.homePhone,
          Parent_MobilePhone : group.value.mobilePhone,
          textingOption : this.submittextingoption(group.value.textingoption),
          Parent_Email : group.value.email,
          Parent_Name : group.value.parentName,
          Parent_Relationship : group.value.relationship,
          VolunteerCheckIn : group.value.VolunteerCheckIn,
          volunteerPosition :this.parentvolpos(group.value.Parent_VolunteerPosition)
        };
        player_parent.push(rd);      
    });
    return player_parent;
  }

  submittextingoption(submittexting:any){
    var option='';
    if (submittexting != null) {
      for (let i = 0; i < submittexting.length; ++i) {
        {
          option += submittexting[i].id + ',';
        }
      }
      return option; 
    }
  }

  parentvolpos(parentvolposition:any){
    var VolunteerPosition={
      Parent_VolunteerPosition:parentvolposition
    }
    return VolunteerPosition;
  }

  getapparelinfo(){
    var rd = {
      ShortSizeId:this.profileForm.get('ShortSizeId').value,
      JerseySizeId :this.profileForm.get('JerseySizeId').value,
      RequestedJersey1Id:this.profileForm.get('RequestedJersey1Id').value,
      RequestedJersey2Id:this.profileForm.get('RequestedJersey2Id').value,
      AssignedJerseyLock:this.profileForm.get('AssignedJerseyLock').value,
      JerseySizeLock:this.profileForm.get('JerseySizeLock').value,
      RequestedJersey1Lock:this.profileForm.get('RequestedJersey1Lock').value,
      RequestedJersey2Lock:this.profileForm.get('RequestedJersey2Lock').value,
      ShortSizeLock:this.profileForm.get('ShortSizeLock').value,
  
    };
    return rd;
  }

  onSubmit() {
    this.fetchingData = true;
     var playerDetails={
      ShirtSizeValue:this.ShirtSizeValue, 
      apparel:this.getapparelinfo(),
      parentInfo:this.getparentinfo(),
      playerInfo:this.profileSection.Value.playerInfo,
      registrationStatus:this.registrationStatus,
      textingOption:this.textingoption,
      transactionHistory:this.transactionHistory      
    };
    this.saveProfileData(playerDetails);   
  }
  
  saveProfileData(playerDetails:any){
    this.playerService.saveProfileData(playerDetails)
    .subscribe((res) => {
      res = JSON.parse(res["_body"]);
      this.fetchingData = false; 
      if(res['Status']){
        this.showSuccessfullpop(res['Status'],res['Message']['PopupHeading'],res['Message']['PopupMessage']);
        this.router.navigate(["/player/profile"]);
      }else{
        this.bsModalRef = this.modalService.show(ErrorModalComponent);
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.errorTitle = res['Message']['PopupHeading'];
        this.bsModalRef.content.errorMsg = res['Message']['PopupMessage'];
        this.playerService.indicator.next(true);
        this.bsModalRef.content.route = "/player/profile";
      }
      
    });
  }
  

  modalRed: BsModalRef;
  withdraw(playerId: number, status: JSON) {
    this.bsModalRef = this.modalService.show(WithdrawComponent);
    this.bsModalRef.content.playerId = playerId;
    this.bsModalRef.content.details = status;
  }

  changeShortSize(event:any) {
    this.ShortSizeId.setValue(event.target.value, {
    onlySelf: true
    })
  }  
  changeJersySize(event:any) {
    this.JersySize.setValue(event.target.value, {
      onlySelf: true
    })
  }

  changeRequestedJersey1Id(event:any) {
    this.RequestedJersey1Id.setValue(event.target.value, {
      onlySelf: true
    })
  }
  changeRequestedJersey2Id(event:any) {
    this.RequestedJersey2Id.setValue(event.target.value, {
      onlySelf: true
    })
  }

  get ShortSizeId() {
    return this.profileForm.get('ShortSizeId');
  }
  get JersySize() {
    return this.profileForm.get('JerseySizeId');
  }

  get RequestedJersey1Id() {
    return this.profileForm.get('RequestedJersey1Id');
  }

  get RequestedJersey2Id() {
    return this.profileForm.get('RequestedJersey2Id');
  }

  errormethod(msg:any){
    this.bsModalRef = this.modalService.show(ErrorModalComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.errorMsg = msg;
}

showSuccessfullpop(status,title,popmsg){
  const initialState = {
    status: status,
    popupTitle: title,
    popupMsg: popmsg
  };

  this.bsModalRef = this.modalService.show(
    SuccessPopupComponent,
    Object.assign({}, { class: 'customModalWidth75', initialState })
  );
}
 
}

