  export interface CoachTeamSection {
    Error: string;
    IsEncrypted: boolean;
    Message: string;
    SessionKey: string;
    Value: Value;
  }

  export interface Value {
    TeamName:string;
    TeamLeaders:Array<TeamLeaders>;
    HealthConditions:Array<HealthConditions>;
    TeamRoster:Array<TeamRoster>;
  }

  export interface TeamLeaders {
    VolunteerPosition:string;
    VolunteerName:string;
    Email:string;
    Mobile:string;    
  }

  export interface HealthConditions {
    
    
  }

  export interface TeamRoster {
    JerseyNumber:number;
    PlayerName:string;
    Parents:Array<Parents>;
    Photo:string;  
  }

  export interface Parents {
    ParentId:number;
    ParentName:string;
    ParentEmail:string;
    ParentMobilePhone:string;    
  }