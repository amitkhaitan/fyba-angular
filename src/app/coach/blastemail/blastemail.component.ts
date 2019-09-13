import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { UploadAdapter } from './../../player/team/compose-email/uploadAdapter';
import { CoachService } from '../coach.service';
import { RequestedData } from './../models/blastemail.model';
import { DataSharingService } from './../../data-sharing.service';
import { ValidationModalComponent } from './../../official/report-game/validation-modal/validation-modal.component';
import { RequestStatusPopupComponent } from './../../common/request-status-popup/request-status-popup.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as $ from 'jquery';

const { detect } = require('detect-browser');
const browser = detect();
declare var require: any;
@Component({
  selector: 'app-blastemail',
  templateUrl: './blastemail.component.html',
  styleUrls: ['./blastemail.component.css']
})
export class BlastemailComponent {
  public Editor = ClassicEditor;
  recepient;
  blastemail:RequestedData;
  blastemailtext:string;
  blastemailtype:boolean;
  blasttext:string;
  blastemailto:string;
  blastemailfrom:string;
  emailForm: FormGroup;
  bsModalRef: BsModalRef;
  loader: boolean;
  popuptext:string;
  blasticon:string;
  SendEmails:Array<string>;
  public data:string;
  public fields: Object = {};
  public waterMark: string = '';
  public box : string = '';
  public value:any = [];
  public FinalEmail:any = [];
  constructor(private fb: FormBuilder,
    public modalService: BsModalService,
    private router: Router,private route:ActivatedRoute,
    private CoachService: CoachService, private dss: DataSharingService) {
    
  }
  

  ngOnInit() {
      this.blastemailtext=this.route.snapshot.paramMap.get('blasttype');
      //console.log(this.blastemailtext);
      
      if(this.blastemailtext=='blast_email'){
          this.fields = { text: 'email', value: 'id' };
          this.waterMark= 'Email ';    
          this.SendEmails=this.CoachService.teamInfoData.SendEmails;
          this.box= 'Box';
          for(let i=1;i<=this.SendEmails.length;i++)
          {
            this.value.push(i);
          }
          this.blastemailtype=true;
          this.blasttext='EMAIL';
          this.blastemailto=this.CoachService.recepientemail;
          this.blasticon="./assets/images/mail-icon-b.png";
      }else{
        this.fields = { text: 'mobile', value: 'id' };
        this.waterMark= 'PhoneNumber ';    
        this.box= 'Box';
        this.SendEmails=this.CoachService.teamInfoData.SendTexts;
        for(let i=0;i<this.SendEmails.length;i++)
          {
            this.value.push(this.SendEmails[i]['id']);
          }
        
        this.blastemailtype=false;
        this.blasttext='TEXT';
        this.blastemailto=this.CoachService.recepientmobileno;
        this.blasticon="./assets/images/sms-icon-b.png";
      }
      
      this.blastemailfrom=this.dss.name+'('+this.dss.email+')';
      this.emailForm = this.fb.group({
        recepient: this.fb.control(this.value),
        subject:this.fb.control([]),
        body:this.fb.control([]),
        blasttype:this.fb.control(this.blasttext),
      })
  }
  onSubmit() {
    this.loader = true;  
    if(this.emailForm.get('blasttype').value=='EMAIL'){
         this.SendBlastEmail();   
    }else{
      this.SendBlastText();
    }   
  }

  SendBlastEmail(){
    var responseBody;
    for(let i=0;i<(this.emailForm.get('recepient').value).length;i++)
    {
      if(this.SendEmails[i]['id']==(this.emailForm.get('recepient').value)[i])
      {
        this.FinalEmail.push(this.SendEmails[i]['email'].split('(')[1].split(')')[0]);
      }
    }
    if(this.emailForm.get('subject').value.length>0 && this.emailForm.get('body').value.length>0){

      this.CoachService.sendEmail(this.emailForm.get('subject').value, this.emailForm.get('body').value,this.FinalEmail.toString())
     .subscribe(
       (res) => {
         this.loader = false;
         responseBody = JSON.parse(res["_body"]);
         console.log(responseBody);
          this.CoachService.emailFlag = false;
          this.bsModalRef = this.modalService.show(RequestStatusPopupComponent);
          this.bsModalRef.content.status = responseBody.Status;
          this.bsModalRef.content.popupTitle = responseBody.Message.PopupHeading;
          this.bsModalRef.content.popupMsg = responseBody.Message.PopupMessage;
          this.CoachService.indicator.next(true);
          this.bsModalRef.content.route = "/coach/teaminfo";          
       }
     )
    }else{
       if(this.emailForm.get('subject').value.length<=0  && this.emailForm.get('body').value.length<=0){
         this.popuptext='Subject and Body';
       }else if(this.emailForm.get('subject').value.length<=0  && this.emailForm.get('body').value.length>0){
         this.popuptext='Subject';
       }else if(this.emailForm.get('subject').value.length>0  && this.emailForm.get('body').value.length<=0){
         this.popuptext='Body';
       }      
       this.ValidationPopupMethod(this.popuptext);     
    }
  }

  SendBlastText(){
    var responseBody;
    for(let i=0;i<(this.emailForm.get('recepient').value).length;i++)
    {
      if(this.SendEmails[i]['id']==(this.emailForm.get('recepient').value)[i])
      {
        this.FinalEmail.push(this.SendEmails[i]['mobile'].split('(')[1].split(')')[0]);
      }
    }
   if(this.emailForm.get('body').value.length>0){
      this.CoachService.sendText(this.emailForm.get('body').value,this.emailForm.get('recepient').value.toString(),this.FinalEmail.toString())
     .subscribe(
       (res) => {
         this.loader = false;
         responseBody = JSON.parse(res["_body"]);
           console.log(responseBody);
          this.CoachService.emailFlag = false;
          this.bsModalRef = this.modalService.show(RequestStatusPopupComponent);
          this.bsModalRef.content.status = responseBody.Status;
          this.bsModalRef.content.popupTitle = responseBody.Message.PopupHeading;
          this.bsModalRef.content.popupMsg = responseBody.Message.PopupMessage;
          this.CoachService.indicator.next(true);
          this.bsModalRef.content.route = "/coach/teaminfo";          
       }
     )
    }else{      
          this.popuptext='Text';      
          this.ValidationPopupMethod(this.popuptext);     
    }
  }

  ValidationPopupMethod(popupmsg:any){
      const initialState = {
        popupTitle: 'Error',
        popupMsg:
          'Please enter ' + popupmsg
      };
    this.bsModalRef = this.modalService.show(
      ValidationModalComponent,
      Object.assign({}, { class: 'customModalWidth75', initialState })
    );
    this.loader = false;
  }
  
  cancel() {
    this.CoachService.emailFlag = false;
    this.CoachService.indicator.next(true);
    this.router.navigate(["coach/teaminfo"]);
  }

  onReady(eventData) {
    // console.log(eventData);
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      // console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }
}
