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
  calendar_icon: string;
  profileData=null;
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
    this.calendar_icon = './assets/images/calendar_icon.png';
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
    this.GetCoachData().then(() => {
      this.dss.currentRoute = 'coach';
    });
  }

  async GetCoachData(){
    await this.coachService.GetCoachData().subscribe((res)=>{
       this.coachSection=JSON.parse(res['_body']);
       console.log(this.coachSection);
       if (this.TeamList != null) this.coachData = this.TeamList[0];
       this.dss.TeamId = this.coachData["TeamId"];

       this.coachService.GetCoachProfileData().subscribe((res)=>{
          if(res.Status==true){
            this.profileData=res;
            console.log(this.profileData.Value);
            this.dss.CoachReportResultCountTag=this.profileData.Value.CoachReportResultCountTag;
          }
           this.dataRequest = false;
           this.router.navigate(["/coach/profile"]);
         }
       )

       
    });

  }

  get TeamList() {
    return this.coachSection.Value[0]['coachTeamList'];
  }

  async filterCoachTeam(id: number) {  
    this.dataRequest=true;  
    this.coachData = await this.TeamList.filter((item) => item.TeamId == id);
    this.coachData = this.coachData[0];
    this.dss.TeamId = await id; 
   // console.log(this.dss.TeamId);
    await this.coachService.GetCoachProfileData().subscribe(
      (res)=>{
        if(res.Status==true){
          this.profileData=res;
          this.dss.CoachReportResultCountTag=this.profileData.Value.CoachReportResultCountTag;
        }
        this.dataRequest=false;
        this.router.navigate(["/coach/profile"]);
      }
    )     
  }
}
