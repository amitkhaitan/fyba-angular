import { Component, OnInit } from '@angular/core';
import { PlayerService } from './player.service';
import { IPlayerList } from './models/IPlayerList.interface';
import { Router } from '@angular/router';
import { DataSharingService } from './../data-sharing.service';
import { delay } from 'rxjs/operators';
import { LocationStrategy } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ErrorModalComponent } from './../common/error-modal/error-modal.component';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  //--Image Declarations
  headerImg: string;
  calendar_icon: string;
  team_icon: string;
  share_icon: string;
  report_icon: string;
  officiating: string;
  player1: string;
  player2: string;
  //--Image Declarations

  //--Variable Declarations
  dataRequest: boolean;
  initialFetchError = null;
  errorMsg: string;
  modalRef: BsModalRef;
  public playerSection: IPlayerList = null;
  constructor(
    public modalService: BsModalService,
    public playerService: PlayerService,
    public router: Router,
    public dss: DataSharingService,
    public location: LocationStrategy
  ) {
    this.calendar_icon = './assets/images/calendar_icon.png';
    this.team_icon = './assets/images/team-icon.png';
    this.share_icon = './assets/images/share-icon.png';
    this.report_icon = './assets/images/report_icon.png';
    this.officiating = './assets/images/officiating.png';
    this.player1 = './assets/images/player-1.png';
    this.player2 = './assets/images/player-2.png';
    this.headerImg = 'player_header_img';

    this.location.onPopState(() => {
      // set isBackButtonClicked to true.
      this.dss.isBackButtonClicked=true;
      return false;
    });
  }

  ngOnInit() {    
    this.dataRequest=true;
    this.getPlayerData().then(() => {
      this.dss.currentRoute = 'player';
    }
    );

  }

  async getPlayerData() {
    await this.playerService.getPlayerData().subscribe((res) => {
      this.playerSection = JSON.parse(res['_body']);
      console.log(this.playerSection);
      if (this.playerSection.Error=='500'){
        this.initialFetchError = true;
        this.errorMsg = 'Service Error';
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.dataRequest=false; 
        this.modalRef.content.closeBtnName = 'Close';
        this.modalRef.content.errorMsg = 'Service Error';
      }
      if (this.playerLists != null) this.playerData = this.playerLists[0];
      this.playerService.playerId = this.playerData["PlayerId"];
      
      this.playerService.getPlayerProfile().subscribe(
        (res)=>{
          this.playerService.profileData = JSON.parse(res["_body"]);   
          console.log(this.playerService.profileData);        
          this.dss.DivisionId = this.playerService.profileData.Value.playerInfo.DivisionId;
          this.dss.Division = this.playerService.profileData.Value.playerInfo.Division;         
          this.dataRequest = false;
          this.router.navigate(["/player/profile"]);
        }
        , (err) => {
          this.initialFetchError = true;
          this.errorMsg = err;
          this.modalRef = this.modalService.show(ErrorModalComponent);
          this.dataRequest=false; 
          this.modalRef.content.closeBtnName = 'Close';
          this.modalRef.content.errorMsg = err;
          
        }
      )      
    });  
  }


  get playerLists() {
    return this.playerSection.Value[0]['playerList'];
  }

  playerData: JSON;
  async filterPlayer(id: number) {    
    this.dataRequest=true;
    this.playerData = await this.playerLists.filter((item) => item.PlayerId == id);
    this.playerData = this.playerData[0];
    this.playerService.playerId = await id;
    await this.playerService.getPlayerProfile().subscribe(
      (res)=>{
       
        this.playerService.profileData = JSON.parse(res["_body"]);
        console.log(this.playerService.profileData);
        this.dss.DivisionId = this.playerService.profileData.Value.playerInfo.DivisionId;
        this.dss.Division = this.playerService.profileData.Value.playerInfo.Division;      
        this.dataRequest=false;
        this.router.navigate(["/player/profile"]);
      }
    )   
  }


}
