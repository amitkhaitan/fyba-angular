import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod, } from '@angular/http';
import { Constants } from './../constants';
import { CoachProfileRequest } from './models/profileRequest.model';
import { CoachProfileResponse } from './models/profileResponse.model';
import { DataSharingService } from './../data-sharing.service';
import { IEmail } from './models/blastemail.model';
import { Observable, TimeoutError } from 'rxjs';
import { map } from 'rxjs/operators'
import { IncidentReports } from './models/coachReport.model';
import { CookieService } from 'ngx-cookie-service';
import { FinalFilter } from '../official/classes/selectgame/finalFilter.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CoachService {
  teamId;
  dataChanged:boolean;
  serviceError:boolean;
  reportRequest:boolean;
  initialJson: string;
  emailFlag:boolean;
  profileData=null;
  calendarData=null;
  teamInfoData=null;
  finalFilter = new FinalFilter();
  IncidentReports: IncidentReports[] = [];
  NewIncidents: IncidentReports[] = [];
  ModifiedIncidents: IncidentReports[] = [];

  recepientemailId: string;
  recepientemail:string;
  recepientmobileno:string;
  recipentparentId:string;
  from:string;
  public indicator = new Subject<boolean>();
  constructor(private http: Http, 
    private dss: DataSharingService,
    private cookieService: CookieService) { 
    this.headerOptions = new Headers({ 'Content-Type': 'application/json' });
    this.postRequestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: this.headerOptions
    });
  }

  postRequestOptions;
  headerOptions;
  timeoutError: boolean;
 
  
  GetCoachData():Observable<any>{
      var getCoachModel = new CoachProfileRequest();
      getCoachModel.UserID = this.dss.userId;
      getCoachModel.SessionKey = this.dss.sessionKey;
      getCoachModel.RequestedData = JSON.stringify({
        LeagueId: this.dss.leagueId,
        SeasonId: this.dss.seasonId,
        VolunteerSeasonalId:this.dss.VolunteerSeasonalId,
        VolunteerId:this.dss.VolunteerId
      });
    var body = JSON.stringify(getCoachModel);
    console.log(body)
    return this.http.post(Constants.apiURL +'/api/CoachTeam', body, this.postRequestOptions);
  }

  GetCoachProfileData(): Observable<CoachProfileResponse>{
    var getCoachModel = new CoachProfileRequest();
    getCoachModel.UserID = this.dss.userId;
    getCoachModel.SessionKey = this.dss.sessionKey;
    getCoachModel.RequestedData = JSON.stringify({
      LeagueId: this.dss.leagueId,
      SeasonId: this.dss.seasonId,
      VolunteerSeasonalId: this.dss.VolunteerSeasonalId,
      VolunteerId:this.dss.VolunteerId,
      TeamId:this.dss.TeamId
    })
    var body = JSON.stringify(getCoachModel);
    console.log(body);
    return this.http.post(Constants.apiURL+'/api/CoachDetails', body, this.postRequestOptions)
    .pipe(map((res)=>res.json()))
    
  }

  getReportResultData(): Observable<any> {
    var getCoachReportData = new CoachProfileRequest();
      getCoachReportData.UserID = this.dss.userId;
      getCoachReportData.SessionKey = this.dss.sessionKey;
      getCoachReportData.RequestedData = JSON.stringify({
          SeasonId: this.dss.seasonId,
          VolunteerSeasonalId: this.dss.VolunteerSeasonalId,
          TeamId:this.dss.TeamId
      })
      var body = JSON.stringify(getCoachReportData);
      console.log(body);
    return this.http.post(Constants.apiURL+'/api/CoachReportGames', body, this.postRequestOptions)
    .pipe(map((res)=>res.json()))
   
  }

  sendEmail(subject,emailBody): Observable<any> {
    var emailModel = new IEmail();
    emailModel.UserID = this.dss.userId;
    emailModel.SessionKey = this.dss.sessionKey;
    emailModel.RequestedData = JSON.stringify({
      ToEmailIds:this.recepientemail,
      FromEmailId: this.dss.email,
      Subject: subject,
      Body: emailBody,
      SeasonId: this.dss.seasonId,
      LeagueId: this.dss.leagueId
    });
    var body = JSON.stringify(emailModel);
      console.log(body);
    return this.http.post(Constants.apiURL + '/api/SendMail', body, this.postRequestOptions);
  }

  sendText(emailBody): Observable<any> {
    var emailModel = new IEmail();
    emailModel.UserID = this.dss.userId;
    emailModel.SessionKey = this.dss.sessionKey;
    emailModel.RequestedData = JSON.stringify({
      ToPhoneNumbers:this.recepientmobileno,
      BodyText: emailBody,
      PageType:'Coach',
      SeasonId: this.dss.seasonId,
      LeagueId: this.dss.leagueId,
      ParentsUserIds:this.recipentparentId
    });
    var body = JSON.stringify(emailModel);
    console.log(body);
    return this.http.post(Constants.apiURL + '/api/SendText', body, this.postRequestOptions);
  }

  public getPdfUrl(url: string): any {
    return this.http.get(url);
  }

   /* - This function is used to post the entire gameList model to the API.
  It comes into play when the ScoreKeeper make any changes to the player scores in a specific game. 
  An updated model with all the scores is sent to the database and the records are updated. - */
  postReportTitle: string;
  postReportMsg: string;
  postReportStatus: boolean;

  postReportData(gameListObj: any):Observable<any> {
    this.reportRequest = true;
    this.postReportMsg = null;
    this.finalFilter.RequestedData = JSON.stringify(gameListObj);
    this.finalFilter.SessionKey = this.dss.sessionKey;
    this.finalFilter.UserID = this.dss.userId.toString();
    var body = JSON.stringify(this.finalFilter);
    console.log(body);
    var headerOptions = new Headers({ 'Content-Type': 'application/json' });
    var requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: headerOptions
    });
    return this.http.post(Constants.apiURL + '/api/CoachReportGamesSave', body, requestOptions)
  }

  getcoachCalendarData(): Observable<any>{
    var getCoachCalendarModel = new CoachProfileRequest();
    getCoachCalendarModel.UserID = this.dss.userId;
    getCoachCalendarModel.SessionKey = this.dss.sessionKey;
    getCoachCalendarModel.RequestedData = JSON.stringify({
      LeagueId: this.dss.leagueId,
      SeasonId: this.dss.seasonId,
      VolunteerSeasonalId: this.dss.VolunteerSeasonalId,
      VolunteerId:this.dss.VolunteerId,
      TeamId:this.teamId
    })    
    var body = JSON.stringify(getCoachCalendarModel);
    console.log(body);
    return this.http.post(Constants.apiURL+'/api/CoachCalendar', body, this.postRequestOptions)
    .pipe(map((res)=>res.json()))
    
  }

  getcoachTeamInfoData(): Observable<any>{
    var getCoachTeamInfoModel = new CoachProfileRequest();
    getCoachTeamInfoModel.UserID = this.dss.userId;
    getCoachTeamInfoModel.SessionKey = this.dss.sessionKey;
    getCoachTeamInfoModel.RequestedData = JSON.stringify({
      LeagueId: this.dss.leagueId,
      SeasonId: this.dss.seasonId,
      VolunteerSeasonalId: this.dss.VolunteerSeasonalId,
      VolunteerId:this.dss.VolunteerId,
      TeamId:this.dss.TeamId

    })    
    var body = JSON.stringify(getCoachTeamInfoModel);
    console.log(body);
    return this.http.post(Constants.apiURL+'/api/CoachTeamInfo', body, this.postRequestOptions)
    .pipe(map((res)=>res.json()))
    
  }
  
  saveProfileData(requestedData):Observable<any>{
    var CoachProfileModel = new CoachProfileRequest();
    CoachProfileModel.UserID = this.dss.userId;
    CoachProfileModel.SessionKey = this.dss.sessionKey;
    CoachProfileModel.RequestedData = JSON.stringify(requestedData);
    //console.log(CoachProfileModel.RequestedData);
    var body = JSON.stringify(CoachProfileModel);
    console.log(body);
    return this.http.post(Constants.apiURL + '/api/CoachDetailsSave',body, this.postRequestOptions).pipe(map((res)=>res.json()))
  }



  private handleError(error: any) {
    if (error instanceof TimeoutError) {
      this.timeoutError = true;
    }
    this.serviceError = true;
    this.reportRequest = false;
  }
  
}
