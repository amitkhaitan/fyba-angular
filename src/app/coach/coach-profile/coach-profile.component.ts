import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataSharingService } from './../../data-sharing.service';
import { CoachService }  from './../coach.service';
import { Router } from '@angular/router';
import { CoachProfileResponse } from './../models/profileResponse.model';
import { FormBuilder,FormArray,FormControl, FormGroup } from '@angular/forms';
import { ArrayValidators } from './checkbox.validator';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-coach-profile',
  templateUrl: './coach-profile.component.html',
  styleUrls: ['./coach-profile.component.css']
})
export class CoachProfileComponent implements OnInit {
  dataRequest: boolean;
  profileData: CoachProfileResponse = null;
  personalDetailsForm;
  preferenceForm;
  img1:string;
  img2:string;
  /****shirt Size *****/
  currentSrc:string;
  disableShirtSize:boolean;
  selectedclass:string;
  /*************** */
  /****location rank value */
  locRankSrc:string;
  disablelocRank:boolean;
  locclass:string;
  /***************/
  /****day week  rank value */
  dayRankSrc:string;
  disableDayRank:boolean;
  Dayclass:string;
  /**********************/
  /****Time of day  rank value ***/
  timeDayRankSrc:string;
  disableTimeDayRank:boolean;
  TimeDayclass:string;
  /****************/
  /****location prefererneces value ***/
  locPrefSrc:string;
  disablelocPref:boolean;
  locPrefclass:string;
  /****************/
  /****Day of the week preferences ***/
  weekPrefSrc:string;
  disableweekPref:boolean;
  weekPrefclass:string;
  /****************/

  /****Time of day preferences ***/
  timePrefSrc:string;
  disableTimePref:boolean;
  TimePrefclass:string;
  /****************/

  /****days not practices ***/
  DayNotPracSrc:string;
  disableDayNotPrac:boolean;
  DayNotPracclass:string;
  /****************/
  /****Time not practices ***/
  TimeNotPracSrc:string;
  disableTimeNotPrac:boolean;
  TimeNotPracclass:string;
  /****************/
  bsModalRef: BsModalRef;
  errormsg:string;
  selecteddayOfTheWeekRank:number;
  selectedtimeOfTheDayRank:number;
  countpatchDaysYouCantHavePractice:number;
  countpatchTimeYouCantHavePractice:number;
  selectedDaysNotPractices:string;
  selectedTimeNotPractices:string;

  constructor(private dss: DataSharingService, 
    private coachService: CoachService,
    private config: NgbAccordionConfig,
    private router: Router,
    private fb: FormBuilder,
    private snackbar: MatSnackBar, 
    private modalService: BsModalService) {   
      config.closeOthers=true;
      this.img1="./assets/images/lock.png",
      this.img2="./assets/images/unlock.png"
      this.currentSrc = this.img1;      
    }
    
  ngOnInit() {
    this.dataRequest=true;    
    this.coachService.getCoach()
    .subscribe(
      (res)=>{        
        this.profileData = res;
         console.log(this.profileData.Value);
          if(this.profileData.Value.ShirtSizeLock==true){
            this.currentSrc=this.img1;
            this.disableShirtSize=true;
            this.selectedclass='selectBG';
          }else{
            this.currentSrc=this.img2;
            this.disableShirtSize=false;
            this.selectedclass='';
          }
          if(this.profileData.Value.LocationRankValuesLock==true){
            this.locRankSrc=this.img1;
            this.disablelocRank=true;
            this.locclass='selectBG';
          }else{
            this.locRankSrc=this.img2;
            this.disablelocRank=false;
            this.locclass='';
          }
          if(this.profileData.Value.DayOfTheWeekRankValuesLock==true){
            this.dayRankSrc=this.img1;
            this.disableDayRank=true;
            this.Dayclass='selectBG';
          }else{
            this.dayRankSrc=this.img2;
            this.disableDayRank=false;
            this.Dayclass='';
          }  
          if(this.profileData.Value.TimeOfDayRankValuesLock==true){
            this.timeDayRankSrc=this.img1;
            this.disableTimeDayRank=true;
            this.TimeDayclass='selectBG';
          }else{
            this.timeDayRankSrc=this.img2;
            this.disableTimeDayRank=false;
            this.TimeDayclass='';
          }
          if(this.profileData.Value.LocationPreferenceValuesLock==true){
            this.locPrefSrc=this.img1;
            this.disablelocPref=true;
            this.locPrefclass='selectBG';
          }else{
            this.locPrefSrc=this.img2;
            this.disablelocPref=false;
            this.locPrefclass='';
          }      
          if(this.profileData.Value.DayOfTheWeekPreferenceValuesLock==true){
            this.weekPrefSrc=this.img1;
            this.disableweekPref=true;
            this.weekPrefclass='selectBG';
          }else{
            this.weekPrefSrc=this.img2;
            this.disableweekPref=false;
            this.weekPrefclass='';
          }
          if(this.profileData.Value.TimeOfDayPreferenceValuesLock==true){
            this.timePrefSrc=this.img1;
            this.disableTimePref=true;
            this.TimePrefclass='selectBG';
          }else{
            this.timePrefSrc=this.img2;
            this.disableTimePref=false;
            this.TimePrefclass='';
          }

          if(this.profileData.Value.DaysYouCannotHavePracticeValuesLock==true){
            this.DayNotPracSrc=this.img1;
            this.disableDayNotPrac=true;
            this.DayNotPracclass='selectBG';
          }else{
            this.DayNotPracSrc=this.img2;
            this.disableDayNotPrac=false;
            this.DayNotPracclass='';
          }

          if(this.profileData.Value.TimeYouCannotHavePracticeValuesLock==true){
            this.TimeNotPracSrc=this.img1;
            this.disableTimeNotPrac=true;
            this.TimeNotPracclass='selectBG';
          }else{
            this.TimeNotPracSrc=this.img2;
            this.disableTimeNotPrac=false;
            this.TimeNotPracclass='';
          }
        this.countpatchDaysYouCantHavePractice=0;
        this.countpatchTimeYouCantHavePractice=0;    
        this.generateDetailsForm();
        this.generatePracticePreferenceForm();
        this.dataRequest = false;
      },
      (error)=>{
        this.dataRequest = false;   
      }
    )
  }

  get CoachProfile(){
    return this.profileData.Value;
  }
  


  async generateDetailsForm(){
    this.personalDetailsForm = await this.fb.group({
      coachName:this.profileData.Value.CoachName,
      email: this.profileData.Value.Email,
      shirtSize: new FormControl({value:this.initShirtSize(),disabled:this.disableShirtSize }),   
      snacksField: '',
    })
    var x = await setInterval(() => {
      clearInterval(x);
    }, 1000);    
    
  }

  initShirtSize(){
    for(var i=0; i<this.profileData.Value.ShirtSizeValue.length; ++i){   
       if(this.profileData.Value.ShirtSizeValue[i].Selected)
       return this.profileData.Value.ShirtSizeValue[i].SizeId;
      }

  }

  async generatePracticePreferenceForm(){
    this.preferenceForm = await this.fb.group({
      locationPreference: this.patchLocationPreference(),
      locationRank:new FormControl({value:this.locationRank(), disabled:this.profileData.Value.LocationRankValuesLock}),
      dayOfTheWeekPreference: this.patchDayOfTheWeekPreference(),
      dayOfTheWeekRank:new FormControl({value:this.dayOfTheWeekRank(), disabled:this.profileData.Value.DayOfTheWeekRankValuesLock}),
      timeOfTheDayPreference: this.patchTimeOfTheDayPreference(),
      timeOfTheDayRank: new FormControl({value:this.timeOfTheDayRank(), disabled:this.profileData.Value.DayOfTheWeekRankValuesLock}),
      daysYouCantHavePractice: this.patchDaysYouCantHavePractice(),
      timeYouCantHavePractice: this.patchTimeYouCantHavePractice()

    })

    var x = await setInterval(() => {
       this.selecteddayOfTheWeekRank=this.preferenceForm.value.dayOfTheWeekRank;  
       this.selectedtimeOfTheDayRank=this.preferenceForm.value.timeOfTheDayRank; 
       this.selectedDaysNotPractices=this.preferenceForm.value.daysYouCantHavePractice;  
       this.selectedTimeNotPractices=this.preferenceForm.value.timeYouCantHavePractice; 
      clearInterval(x);
    }, 1000);    
    

  }
  
  locationRank(){
    for(var i=0; i<this.profileData.Value.LocationRankValues.length; ++i){   
       if(this.profileData.Value.LocationRankValues[i].Selected)
       return this.profileData.Value.LocationRankValues[i].RankId;
      }

  }
  dayOfTheWeekRank(){
    for(var i=0; i<this.profileData.Value.DayOfTheWeekRankValues.length; ++i){   
       if(this.profileData.Value.DayOfTheWeekRankValues[i].Selected)
       return this.profileData.Value.DayOfTheWeekRankValues[i].RankId;
    }

  }
  timeOfTheDayRank(){
    for(var i=0; i<this.profileData.Value.TimeOfDayRankValues.length; ++i){   
       if(this.profileData.Value.TimeOfDayRankValues[i].Selected)
       return this.profileData.Value.TimeOfDayRankValues[i].RankId;
      }

  }
  
  patchLocationPreference(){
    let arr = new FormArray([]);
    for(var i=0; i<this.profileData.Value.LocationPreferenceValues.length;++i){
      arr.push(this.fb.group({
        LocationId:this.profileData.Value.LocationPreferenceValues[i].LocationId,
        LocationName:this.profileData.Value.LocationPreferenceValues[i].LocationName,
        Selected:this.profileData.Value.LocationPreferenceValues[i].Selected
      }))
    }
    return arr;
  }

  patchDayOfTheWeekPreference(){
    let arr = new FormArray([]);
    for(var i=0; i<this.profileData.Value.DayOfTheWeekPreferenceValues.length;++i){
      arr.push(this.fb.group({
        DayId:this.profileData.Value.DayOfTheWeekPreferenceValues[i].DayId,
        DayName:this.profileData.Value.DayOfTheWeekPreferenceValues[i].DayName,
        Selected:this.profileData.Value.DayOfTheWeekPreferenceValues[i].Selected
      }))
    }
    return arr;
  }

  patchTimeOfTheDayPreference(){
    let arr = new FormArray([]);
    for(var i=0; i<this.profileData.Value.TimeOfDayPreferenceValues.length;++i){      
      arr.push(this.fb.group({
        TimeId:this.profileData.Value.TimeOfDayPreferenceValues[i].TimeId,
        TimeName:this.profileData.Value.TimeOfDayPreferenceValues[i].Time,
        Selected:this.profileData.Value.TimeOfDayPreferenceValues[i].Selected
      }))
    }
    return arr;
  }

  patchDaysYouCantHavePractice(){
    let arr = new FormArray([]);
    for(var i=0; i<this.profileData.Value.DaysYouCannotHavePracticeValues.length;++i){
      if(this.profileData.Value.DaysYouCannotHavePracticeValues[i].Selected==true){
        this.countpatchDaysYouCantHavePractice=this.countpatchDaysYouCantHavePractice+1;
      }
      arr.push(this.fb.group({
        DayId:this.profileData.Value.DaysYouCannotHavePracticeValues[i].DayId,
        DayName:this.profileData.Value.DaysYouCannotHavePracticeValues[i].DayName,
        Selected:this.profileData.Value.DaysYouCannotHavePracticeValues[i].Selected
      }))
    }
    return arr;
  }

  patchTimeYouCantHavePractice(){
    let arr = new FormArray([],ArrayValidators.maxLength(3));
    for(var i=0; i<this.profileData.Value.TimeYouCannotHavePracticeValues.length;++i){
      if(this.profileData.Value.TimeYouCannotHavePracticeValues[i].Selected==true){
        this.countpatchTimeYouCantHavePractice=this.countpatchTimeYouCantHavePractice+1;
      }
      arr.push(this.fb.group({
        TimeId:this.profileData.Value.TimeYouCannotHavePracticeValues[i].TimeId,
        TimeName:this.profileData.Value.TimeYouCannotHavePracticeValues[i].Time,
        Selected:this.profileData.Value.TimeYouCannotHavePracticeValues[i].Selected
      }))
    }
    return arr;
  }

 

  onSubmit(){
    this.dataRequest = true;
     var CoachDetails={
      Address:'',
      AssignedDayOfWeek:'',
      AssignedFacility:'',
      AssignedTimeOfDay:'',
      CoachName:'',
      DateFingerPrinted:'',
      DayOfTheWeekPreferenceValues:this.preferenceForm.get('dayOfTheWeekPreference').value,
      DayOfTheWeekPreferenceValuesLock:this.profileData.Value.DayOfTheWeekPreferenceValuesLock,
      DayOfTheWeekRankValues:this.profileData.Value.DayOfTheWeekRankValues,
      DayOfTheWeekRankValuesLock:this.profileData.Value.DayOfTheWeekRankValuesLock,
      DaysYouCannotHavePracticeValues:this.preferenceForm.get('daysYouCantHavePractice').value,
      DaysYouCannotHavePracticeValuesLock:this.profileData.Value.DaysYouCannotHavePracticeValuesLock,
      Email:this.personalDetailsForm.get('email').value,
      HomePhone:'',
      LocationPreferenceValues:this.preferenceForm.get('locationPreference').value,
      LocationPreferenceValuesLock:this.profileData.Value.LocationPreferenceValuesLock,
      LocationRankValues:this.profileData.Value.LocationRankValues,
      LocationRankValuesLock:this.profileData.Value.LocationRankValuesLock,
      MobilePhone:'',
      ShirtSizeLock:this.profileData.Value.ShirtSizeLock,
      ShirtSizeValue:this.profileData.Value.ShirtSizeValue,
      TeamId:'',
      TeamName:'',
      TimeOfDayPreferenceValues:this.preferenceForm.get('timeOfTheDayPreference').value,
      TimeOfDayPreferenceValuesLock:this.profileData.Value.TimeOfDayPreferenceValuesLock,
      TimeOfDayRankValues:this.profileData.Value.TimeOfDayRankValues,  
      TimeOfDayRankValuesLock:this.profileData.Value.TimeOfDayRankValuesLock,
      TimeYouCannotHavePracticeValues:this.preferenceForm.get('timeYouCantHavePractice').value,
      TimeYouCannotHavePracticeValuesLock:this.profileData.Value.TimeYouCannotHavePracticeValuesLock,
      TimeslotName:'',
      VolunteerId:this.profileData.Value.VolunteerId,
      VolunteerSeasonalId:this.profileData.Value.VolunteerSeasonalId,
      WorkPhone:''
    };
    
    this.coachService.saveProfileData(CoachDetails)
      .subscribe((res) => {        
        res = JSON.parse(res["_body"]);
        this.dataRequest = false;
        this.snackbar.open(res.Message.PopupHeading, '', { duration: 3000 });        
      });
  }

  //Event Handling
  preferenceChange(e:any, id:number){ 
    (<FormArray>this.preferenceForm.get('locationPreference')).controls.forEach((group) => {
      let dayIdControl = group.get('LocationId') as FormControl;  
      let selectedControl = group.get('Selected') as FormControl;           
      if (dayIdControl.value == id) {
        if(e.currentTarget.checked){
          selectedControl.setValue(true);
        }else{
          selectedControl.setValue(false);   
        }          
      }         
    });   
}

  dayOfTheWeekPreferenceChange(e:any, id:number){  
    if(e.currentTarget.checked){
      (<FormArray>this.preferenceForm.get('dayOfTheWeekPreference')).controls.forEach((group) => {
        let dayIdControl = group.get('DayId') as FormControl;  
        let selectedControl = group.get('Selected') as FormControl;           
        if (dayIdControl.value == id) {
          if(e.currentTarget.checked){
            selectedControl.setValue(true);
          }else{
            selectedControl.setValue(false);
          }     
        }
         
      });
    }    
  }

  timeOfTheDayPreferenceChange(e:any, id:number){  
      (<FormArray>this.preferenceForm.get('timeOfTheDayPreference')).controls.forEach((group) => {
        let timeIdControl = group.get('TimeId') as FormControl;  
        let selectedControl = group.get('Selected') as FormControl;           
        if (timeIdControl.value == id) {
          if(e.currentTarget.checked){
            selectedControl.setValue(true);
          }else{
            selectedControl.setValue(false);  
          }    
        }         
      });  
  }
  
  daysYouCantHavePracticeChange(e:any, id:number){
    if (e.currentTarget.checked) {
        this.countpatchDaysYouCantHavePractice++;
    }else {
        this.countpatchDaysYouCantHavePractice--;
    }
    
    if (this.countpatchDaysYouCantHavePractice >= 3) {
        
      this.errormsg='You can select max 3 Days you CANNOT have practice.';
      this.errormethod(this.errormsg);

      (<FormArray>this.preferenceForm.get('daysYouCantHavePractice')).disable();
       (<FormArray>this.preferenceForm.get('daysYouCantHavePractice')).controls.forEach((group) => {
          let dayIdControl = group.get('DayId') as FormControl;  
          let selectedControl = group.get('Selected') as FormControl;
          if (dayIdControl.value == id) {
              if (selectedControl.value) {
                selectedControl.setValue(false);
              }else{
                selectedControl.setValue(true);
              }
          }else{
            selectedControl.disable();
          }          
      }); 
    }else if (this.countpatchDaysYouCantHavePractice <= 3) {
      (<FormArray>this.preferenceForm.get('daysYouCantHavePractice')).enable();      
      (<FormArray>this.preferenceForm.get('daysYouCantHavePractice')).controls.forEach((group) => {
        let dayIdControl = group.get('DayId') as FormControl;  
        let selectedControl = group.get('Selected') as FormControl;              
        if(dayIdControl.value==id){            
          if (selectedControl.value) {
                selectedControl.setValue(false);
          }else{
            selectedControl.setValue(true);
          }
        }
        
      });                      
    }        
              
  }


  timeYouCantHavePracticeChange(e:any, id:number){
    if (e.currentTarget.checked) {
      this.countpatchTimeYouCantHavePractice++;
    } else {
      this.countpatchTimeYouCantHavePractice--;
    }    
    if (this.countpatchTimeYouCantHavePractice >= 3) {        
      this.errormsg='You can select max 3 Time you CANNOT have practice.';
      this.errormethod(this.errormsg);

      (<FormArray>this.preferenceForm.get('timeYouCantHavePractice')).disable();
       (<FormArray>this.preferenceForm.get('timeYouCantHavePractice')).controls.forEach((group) => {
          let dayIdControl = group.get('TimeId') as FormControl;  
          let selectedControl = group.get('Selected') as FormControl;
          if (dayIdControl.value == id) {
              if (selectedControl.value) {
                selectedControl.setValue(false);
              }else{
                selectedControl.setValue(true);
              }
          }else{
            selectedControl.disable();
          }          
      }); 
    }else if (this.countpatchTimeYouCantHavePractice <= 3) {
      (<FormArray>this.preferenceForm.get('timeYouCantHavePractice')).enable();      
      (<FormArray>this.preferenceForm.get('timeYouCantHavePractice')).controls.forEach((group) => {
        let dayIdControl = group.get('TimeId') as FormControl;  
        let selectedControl = group.get('Selected') as FormControl;              
        if(dayIdControl.value==id){            
          if (selectedControl.value) {
                selectedControl.setValue(false);
          }else{
            selectedControl.setValue(true);
          }
        }
        
      });                      
    }             
  }

  changeshirtSize(event:any){
    for(var i=0; i<this.profileData.Value.ShirtSizeValue.length; ++i){   
      if(this.profileData.Value.ShirtSizeValue[i].SizeId==event){
        this.profileData.Value.ShirtSizeValue[i].Selected=true;
      }else{
        this.profileData.Value.ShirtSizeValue[i].Selected=false;
      }    
    }
  }

  changelocationRank(event:any){
    for(var i=0; i<this.profileData.Value.LocationRankValues.length; ++i){   
      if(this.profileData.Value.LocationRankValues[i].RankId==event){
        this.profileData.Value.LocationRankValues[i].Selected=true;
      }else{
        this.profileData.Value.LocationRankValues[i].Selected=false;
      }    
    }
  }

  changedayOfTheWeekRank(event:any){
    for(var i=0; i<this.profileData.Value.TimeOfDayRankValues.length; ++i){
        if(this.profileData.Value.TimeOfDayRankValues[i].RankId==event.target.value){
          if(this.profileData.Value.TimeOfDayRankValues[i].Selected==true){
            this.errormsg='Day of week rank and Time of day rank cannot be same';
            this.errormethod(this.errormsg);
            this.preferenceForm.patchValue({
             dayOfTheWeekRank:this.selecteddayOfTheWeekRank
            });
            return false;
          }else{
            for(var i=0; i<this.profileData.Value.DayOfTheWeekRankValues.length; ++i){   
              if(this.profileData.Value.DayOfTheWeekRankValues[i].RankId==event.target.value){
                this.profileData.Value.DayOfTheWeekRankValues[i].Selected=true;
                this.selecteddayOfTheWeekRank=event.target.value;
              }else{
                this.profileData.Value.DayOfTheWeekRankValues[i].Selected=false;
              }    
            }
          }
        }               
    }
  }

  changetimeOfTheDayRank(event:any){
    for(var i=0; i<this.profileData.Value.DayOfTheWeekRankValues.length; ++i){
      if(this.profileData.Value.DayOfTheWeekRankValues[i].RankId==event.target.value){
        if(this.profileData.Value.DayOfTheWeekRankValues[i].Selected==true){
          this.errormsg='Day of week rank and Time of day rank cannot be same';
          this.errormethod(this.errormsg);
          this.preferenceForm.patchValue({
            timeOfTheDayRank:this.selectedtimeOfTheDayRank
          });
          return false;
        }else{
          for(var i=0; i<this.profileData.Value.TimeOfDayRankValues.length; ++i){   
            if(this.profileData.Value.TimeOfDayRankValues[i].RankId==event.target.value){
              this.profileData.Value.TimeOfDayRankValues[i].Selected=true;
              this.selecteddayOfTheWeekRank=event.target.value;
            }else{
              this.profileData.Value.TimeOfDayRankValues[i].Selected=false;
            }    
          }
        }
      }               
  }

}
  
  errormethod(msg:any){
      this.bsModalRef = this.modalService.show(ErrorModalComponent);
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.errorMsg = msg;
  }
}
