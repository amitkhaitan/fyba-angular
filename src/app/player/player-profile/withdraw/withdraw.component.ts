import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PlayerService } from './../../player.service';
import { Router,ActivatedRoute } from '@angular/router';
import { RequestStatusPopupComponent } from './../../../common/request-status-popup/request-status-popup.component';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  constructor(private playerService: PlayerService,public modalService: BsModalService,private route:ActivatedRoute) { }

  
  playerId:number;
  details:JSON;
  bsModalRef: BsModalRef;
  loader: boolean; 

  ngOnInit() {
    console.log(this.details);
  }

  withdraw(){
    this.loader=true; 
    this.playerService.withdrawPlayer(this.playerId)
    .subscribe(
      (res)=>{
        this.loader=false; 
        console.log(JSON.parse(res["_body"]));
        var responseBody=JSON.parse(res["_body"]);
        console.log(responseBody);
        this.bsModalRef = this.modalService.show(RequestStatusPopupComponent);
        this.bsModalRef.content.status = responseBody.Status;
        this.bsModalRef.content.popupTitle = responseBody.Message.PopupHeading;
        this.bsModalRef.content.popupMsg = responseBody.Message.PopupMessage;
        this.playerService.indicator.next(true);
        this.bsModalRef.content.route = "/player/profile";
        this.cancel();   
        //console.log(JSON.parse(res["_body"]));
      }
    )
  }

  cancel(){
    this.bsModalRef.hide();
  }

}
