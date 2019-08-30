export interface CoachTeamList {
    Error: string;
    IsEncrypted: boolean;
    Message: string;
    SessionKey: string;
    Value: Array<TeamList>;
  }
  export interface TeamList {
      TeamId: number;
      TeamName: string;
      TeamPhoto: string;
      Division:string;
  }
  