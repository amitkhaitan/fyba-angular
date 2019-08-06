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

@Injectable({
  providedIn: 'root'
})

export class CoachService {

  dataChanged:boolean;
  serviceError:boolean;
  reportRequest:boolean;
  initialJson: string;
  calenderData=null;
  teamInfoData=null;
  finalFilter = new FinalFilter();
  IncidentReports: IncidentReports[] = [];
  NewIncidents: IncidentReports[] = [];
  ModifiedIncidents: IncidentReports[] = [];

  recepient: string='Kyle Larson (rflarson@yahoo.com , tami@thelarsons.net)';
  from:string='Bob Larson (rflarson@yahoo.com)';
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

  getCoach(): Observable<CoachProfileResponse>{
    var getCoachModel = new CoachProfileRequest();
    getCoachModel.UserID = this.dss.userId;
    getCoachModel.SessionKey = this.dss.sessionKey;
    getCoachModel.RequestedData = JSON.stringify({
      LeagueId: this.dss.leagueId,
      SeasonId: this.dss.seasonId,
      VolunteerSeasonalId: this.dss.VolunteerSeasonalId,
      VolunteerId:this.dss.VolunteerId

    })

    var body = JSON.stringify(getCoachModel);
    return this.http.post(Constants.apiURL+'/api/CoachDetails', body, this.postRequestOptions)
    .pipe(map((res)=>res.json()))
    
  }

  getReportResultData(): Observable<any> {
    return this.http.get('assets/test.json')
      .pipe(map((res) => res))
  }

  sendEmail(subject,emailBody): Observable<any> {
    var emailModel = new IEmail();
    emailModel.UserID = this.dss.userId;
    emailModel.SessionKey = this.dss.sessionKey;
    emailModel.RequestedData = JSON.stringify({
      ToEmailIds:this.recepient,
      FromEmailId: this.dss.email,
      Subject: subject,
      Body: emailBody,
      SeasonId: this.dss.seasonId,
      LeagueId: this.dss.leagueId
    });
    var body = JSON.stringify(emailModel);
    return this.http.post(Constants.apiURL + '/api/SendMail', body, this.postRequestOptions);
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
    var trailingUrl;
    if (gameListObj.OfficiatingPositionId == 3) {
      trailingUrl = '/api/savereportgames';
    } else {
      trailingUrl = '/api/SaveReportGamesNonScoreKeeper';
    }
    this.reportRequest = true;
    this.postReportMsg = null;
    this.finalFilter.RequestedData = JSON.stringify(gameListObj);
    this.finalFilter.SessionKey = this.dss.sessionKey;
    this.finalFilter.UserID = this.dss.userId.toString();
    var body = JSON.stringify(this.finalFilter);
    var headerOptions = new Headers({ 'Content-Type': 'application/json' });
    var requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: headerOptions
    });
    return this.http
      .post(Constants.apiURL + trailingUrl, body, requestOptions)
  }

  timeoutError: boolean;
  private handleError(error: any) {
    if (error instanceof TimeoutError) {
      this.timeoutError = true;
    }
    this.serviceError = true;
    this.reportRequest = false;
  }

  getcoachCalenderData(): Observable<any>{
    var getCoachCalenderModel = new CoachProfileRequest();
    getCoachCalenderModel.UserID = this.dss.userId;
    getCoachCalenderModel.SessionKey = this.dss.sessionKey;
    getCoachCalenderModel.RequestedData = JSON.stringify({
      LeagueId: this.dss.leagueId,
      SeasonId: this.dss.seasonId,
      VolunteerSeasonalId: this.dss.VolunteerSeasonalId,
      VolunteerId:this.dss.VolunteerId

    })
    
    var body = JSON.stringify(getCoachCalenderModel);
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
      VolunteerId:this.dss.VolunteerId

    })    
    var body = JSON.stringify(getCoachTeamInfoModel);
    console.log(body);
    return this.http.post(Constants.apiURL+'/api/CoachTeamInfo', body, this.postRequestOptions)
    .pipe(map((res)=>res.json()))
    
  }

  
}
