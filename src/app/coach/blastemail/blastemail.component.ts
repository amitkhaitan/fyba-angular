import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormArray, FormBuilder, FormControl} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { UploadAdapter } from './../../player/team/compose-email/uploadAdapter';
import { CoachService } from '../coach.service';
import { RequestedData } from './../models/blastemail.model';
import { DataSharingService } from './../../data-sharing.service';
import { ValidationModalComponent } from './../../official/report-game/validation-modal/validation-modal.component';
import { RequestStatusPopupComponent } from './../../common/request-status-popup/request-status-popup.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';



@Component({
  selector: 'app-blastemail',
  templateUrl: './blastemail.component.html',
  styleUrls: ['./blastemail.component.css']
})
export class BlastemailComponent {
  recepient;
  blastemail:RequestedData;
  blastemailtext:string;
  blastemailtype:boolean;
  blasttext:string;
  blastemailto:string;
  blastemailfrom:string;
  public Editor = ClassicEditor;
  emailForm: FormGroup;
  bsModalRef: BsModalRef;
  loader: boolean;
  popuptext:string;
  blasticon:string;
  //postEmailBody: RequestedData;
  constructor(private fb: FormBuilder,
    public modalService: BsModalService,
    private router: Router,private route:ActivatedRoute,
    private CoachService: CoachService, private dss: DataSharingService) {
    
  }

  ngOnInit() {
    this.blastemailtext=this.route.snapshot.paramMap.get('blasttype');
    if(this.blastemailtext=='blast_email'){
        this.blastemailtype=true;
        this.blasttext='EMAIL';
        this.blastemailto=this.CoachService.recepientemail;
        this.blasticon="./assets/images/mail-icon-b.png";
    }else{
      this.blastemailtype=false;
      this.blasttext='TEXT';
      this.blastemailto=this.CoachService.recepientmobileno;
      this.blasticon="./assets/images/sms-icon-b.png";
    }
    
    this.blastemailfrom=this.dss.name+'('+this.dss.email+')';
    this.emailForm = this.fb.group({
      recepient: this.fb.control(this.blastemailto),
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
    if(this.emailForm.get('subject').value.length>0 && this.emailForm.get('body').value.length>0){

      this.CoachService.sendEmail(this.emailForm.get('subject').value, this.emailForm.get('body').value)
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
    if(this.emailForm.get('body').value.length>0){
      this.CoachService.sendText(this.emailForm.get('body').value)
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
  }
  
  cancel() {
    //this.CoachService.emailFlag = false;
    //this.CoachService.indicator.next(true);
    this.router.navigate(["coach/teaminfo"]);
  }

  onReady(eventData) {
    //console.log(eventData);
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      //console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }
}
