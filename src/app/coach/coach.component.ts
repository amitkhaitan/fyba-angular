import { Component, OnInit } from '@angular/core';
import { DataSharingService } from './../data-sharing.service';
import { CoachService }  from './coach.service';
import { Router } from '@angular/router';
import {CoachTeamList} from './models/CoachTeamList.interface';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {
  headerImg: string;
  calender_icon: string;
  game1: string;
  game2: string;
  team_icon: string;
  game_icon: string;
  report_icon: string;
  officiating: string;
  dataRequest:boolean;
  coachData: JSON;
  public coachSection: CoachTeamList = null;
  constructor(public dss: DataSharingService, 
    private coachService: CoachService,
    private router: Router) {
    this.calender_icon = './assets/images/calender_icon.png';
    this.game1 = './assets/images/game1.png';
    this.game2 = './assets/images/game2.png';
    this.team_icon = './assets/images/team_icon.png';
    this.game_icon = './assets/images/game_icon.png';
    this.report_icon = './assets/images/report_icon.png';
    this.officiating = './assets/images/officiating.png';
  }

  ngOnInit() {
    this.headerImg = 'coach_header_img';
    this.dataRequest=true;
    this.getcoachProfileData().then(() => {
      this.dss.currentRoute = 'coach';
    });
  }

  async getcoachProfileData(){
    await this.coachService.getcoachProfileData().subscribe((res)=>{
       this.coachSection=JSON.parse(res['_body']);
       console.log(this.coachSection);
       if (this.TeamList != null) this.coachData = this.TeamList[0];
       this.dss.TeamId = this.coachData["TeamId"];
       this.dataRequest = false;
       this.router.navigate(["/coach/profile"]);
    });

  }

  get TeamList() {
    return this.coachSection.Value[0]['coachTeamList'];
  }

  async filterCoachTeam(id: number) {    
    this.coachData = await this.TeamList.filter((item) => item.TeamId == id);
    this.coachData = this.coachData[0];
    this.dss.TeamId = await id; 
    this.router.navigate(["/coach/profile"]);     
  }
}
