import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataSharingService } from './../../data-sharing.service';
import { CoachService }  from './../coach.service';
import { Router } from '@angular/router';
import { CoachProfileResponse } from './../models/profileResponse.model';
import { FormBuilder,FormArray,FormControl, FormGroup } from '@angular/forms';
import { ArrayValidators } from './checkbox.validator';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';


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

  constructor(private dss: DataSharingService, 
    private coachService: CoachService,
    private config: NgbAccordionConfig,
    private router: Router,
    private fb: FormBuilder) {   
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
        this.generateDetailsForm();
        this.generatePracticePreferenceForm();
        
        this.dataRequest = false;
      },
      (error)=>{
        this.dataRequest = false;
        //console.log(error);       
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
      shirtSize: new FormControl({value:this.initShirtSize(), disabled:this.disableShirtSize}),      
      snacksField: ''
    })
    var x = await setInterval(() => {
      //console.log(this.personalDetailsForm.value);
      clearInterval(x);
    }, 1000);    
    
  }

  initShirtSize(){
    for(var i=0; i<this.profileData.Value.ShirtSizeValue.length; ++i){   
       if(this.profileData.Value.ShirtSizeValue[i].Selected)
       return this.profileData.Value.ShirtSizeValue[i].Size;
      }

  }

  async generatePracticePreferenceForm(){
    this.preferenceForm = await this.fb.group({
      locationPreference: this.patchLocationPreference(),
      locationRank: '',
      dayOfTheWeekPreference: this.patchDayOfTheWeekPreference(),
      dayOfTheWeekRank: '',
      timeOfTheDayPreference: this.patchTimeOfTheDayPreference(),
      timeOfTheDayRank: '',
      daysYouCantHavePractice: this.patchDaysYouCantHavePractice(),
      timeYouCantHavePractice: this.patchTimeYouCantHavePractice()

    })

    var x = await setInterval(() => {
      console.log(this.preferenceForm.value);
      clearInterval(x);
    }, 1000);    
    

  }

  patchLocationPreference(){
    let arr = new FormArray([]);
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
    let arr = new FormArray([],ArrayValidators.maxLength(3));
    for(var i=0; i<this.profileData.Value.DaysYouCannotHavePracticeValues.length;++i){
      arr.push(this.fb.group({
        DayId:this.profileData.Value.DaysYouCannotHavePracticeValues[i].DayId,
        DayName:this.profileData.Value.DaysYouCannotHavePracticeValues[i].DayName,
        Selected:this.profileData.Value.DaysYouCannotHavePracticeValues[i].Selected
      }))
    }
    //arr.setValidators(minLengthError);
    return arr;
  }

  patchTimeYouCantHavePractice(){
    let arr = new FormArray([],ArrayValidators.maxLength(3));
    for(var i=0; i<this.profileData.Value.TimeYouCannotHavePracticeValues.length;++i){
      arr.push(this.fb.group({
        TimeId:this.profileData.Value.TimeYouCannotHavePracticeValues[i].TimeId,
        TimeName:this.profileData.Value.TimeYouCannotHavePracticeValues[i].Time,
        Selected:this.profileData.Value.TimeYouCannotHavePracticeValues[i].Selected
      }))
    }
    //arr.setValidators(minLengthError);
    return arr;
  }

  locationPreference: number[] = []

  preferenceChange(e: any, locationId:number){
    if(e.currentTarget.checked){
      this.locationPreference.push(locationId);
      
    }
    else{
      this.locationPreference = this.locationPreference.filter(item =>  item !== locationId);
    }

    console.log(this.locationPreference);

  }

  onSubmit(){
    
  }

  //Event Handling
  dayOfTheWeekPreferenceChange(e:any, id:number){  
    if(e.currentTarget.checked){
      //const control = <FormArray>this.preferenceForm.get('daysYouCantHavePractice');      
      (<FormArray>this.preferenceForm.get('dayOfTheWeekPreference')).controls.forEach((group) => {
        let dayIdControl = group.get('DayId') as FormControl;  
        let selectedControl = group.get('Selected') as FormControl;    
       
        if (dayIdControl.value == id) {
          console.log("Disable" + dayIdControl.value);
          
          selectedControl.setValue(false);
          selectedControl.disable();
          group.updateValueAndValidity();
          group.disable();        
        }
         
      });
    }
    // else{
    //   (<FormArray>this.preferenceForm.get('dayOfTheWeekPreference')).controls.forEach((group) => {
    //     let dayIdControl = group.get('DayId') as FormControl;    
        
        
    //     if (dayIdControl.value == id) {
    //       console.log("Enable" + dayIdControl.value);   
    //       group.enable();        
    //     }
    //   });
    // }

  }

  daysYouCantHavePracticeChange(e:any, id:number){
    if(e.currentTarget.checked){
      //const control = <FormArray>this.preferenceForm.get('daysYouCantHavePractice');

      
      (<FormArray>this.preferenceForm.get('dayOfTheWeekPreference')).controls.forEach((group) => {
        let dayIdControl = group.get('DayId') as FormControl;  
        let selectedControl = group.get('Selected') as FormControl;    
       
        if (dayIdControl.value == id) {
          console.log("Disable" + dayIdControl.value);
          selectedControl.setValue(false);
          selectedControl.disable();
          group.disable();        
        }
         
      });
    }
    // else{
    //   (<FormArray>this.preferenceForm.get('dayOfTheWeekPreference')).controls.forEach((group) => {
    //     let dayIdControl = group.get('DayId') as FormControl;    
        
        
    //     if (dayIdControl.value == id) {
    //       console.log("Enable" + dayIdControl.value);   
    //       group.enable();        
    //     }
    //   });
    // }

    console.log("Form Valid?"+this.preferenceForm.valid);

  }

  
  // timeOfTheDayPreference
  // timeYouCantHavePractice

  timeOfTheDayPreferenceChange(e:any, id:number){
    if(e.currentTarget.checked){
      //const control = <FormArray>this.preferenceForm.get('daysYouCantHavePractice');

      
      (<FormArray>this.preferenceForm.get('timeYouCantHavePractice')).controls.forEach((group) => {
        let timeIdControl = group.get('TimeId') as FormControl;  
        let selectedControl = group.get('Selected') as FormControl;    
       
        if (timeIdControl.value == id) {
          console.log("Disable" + timeIdControl.value);
          selectedControl.setValue(false);
          selectedControl.disable();
          group.disable();        
        }
         
      });
    }
  }
  
  timeYouCantHavePracticeChange(e:any, id:number){
    if(e.currentTarget.checked){
      //const control = <FormArray>this.preferenceForm.get('daysYouCantHavePractice');

      
      (<FormArray>this.preferenceForm.get('timeOfTheDayPreference')).controls.forEach((group) => {
        let timeIdControl = group.get('TimeId') as FormControl;  
        let selectedControl = group.get('Selected') as FormControl;    
       
        if (timeIdControl.value == id) {
          console.log("Disable" + timeIdControl.value);
          selectedControl.setValue(false);
          selectedControl.disable();
          group.disable();        
        }
         
      });
    }

    

  }

  



}
