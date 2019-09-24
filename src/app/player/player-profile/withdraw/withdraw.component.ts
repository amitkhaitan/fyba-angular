import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PlayerService } from './../../player.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestStatusPopupComponent } from './../../../common/request-status-popup/request-status-popup.component';
import { FormBuilder, FormGroup, Form, FormArray, Validators, FormControl } from '@angular/forms';
import { DataSharingService } from '../../../data-sharing.service';
import { SuccessPopupComponent } from './../../../official/report-game/success-popup/success-popup.component';
import { ErrorModalComponent } from './../../../common/error-modal/error-modal.component';


@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private dss: DataSharingService,
    private playerService: PlayerService,
    public modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) { }
  initialFetchError = null;
  errorMsg: string;
  withdrawForm;
  responseBody;
  dataRequest = false;
  withdrawdata;
  test=2;
  withdrawdd;
  playerId: number;
  details: JSON;
  bsModalRef: BsModalRef;
  loader: boolean;
  interval;

  ngOnInit() {
    if (this.dss.playerId) {
      this.playerId = this.dss.playerId;
      this.loader = true;
      this.getWithdrawData();
    }
    else this.router.navigate(["/player/profile"]);

  }
  getWithdrawData() {
    this.playerService.withdrawPlayer(this.playerId)
      .subscribe(
        (res) => {
          this.dataRequest=true;
          this.loader = false;
          this.responseBody = JSON.parse(res["_body"]);
          console.log(this.responseBody);
          if (this.responseBody.Status == true) {
            this.withdrawdata = this.responseBody.Value.WithdrawPlayerDetails;
            this.withdrawdd = this.responseBody.Value.WithdrawalDropdowns;
            this.generateWithdrawForm();
          }
          else {
            this.modalRef = this.modalService.show(ErrorModalComponent);
            this.loader = false;
            this.modalRef.content.closeBtnName = 'Close';
          }


        }, (err) => {
          this.initialFetchError = true;
          this.errorMsg = err;
          this.modalRef = this.modalService.show(ErrorModalComponent);
          this.loader = false;
          this.modalRef.content.closeBtnName = 'Close';
          this.modalRef.content.errorMsg = err;

        })
  }
  async generateWithdrawForm() {
    this.withdrawForm = this.fb.group({
      WithdrawalExplanation: this.withdrawdata.WithdrawalExplanation,
      WithdrawReason: new FormControl()

    });
  }
  withdraw() {
    this.loader = true;
    var data = {
      PlayerId: this.playerId,
      SeasonId: this.dss.seasonId,
      WithdrawalExplanation: this.withdrawForm.get('WithdrawalExplanation').value,
      WithdrawalReasonId: this.withdrawForm.get('WithdrawReason').value,
      LeagueId: this.dss.leagueId,
      RefundAmount: this.withdrawdata.RefundAmount

    }
    console.log(data);
    this.WithdrawData(data);
  }
  WithdrawData(data: any) {
    this.playerService.WithdrawData(data)
      .subscribe((res) => {
        res = JSON.parse(res["_body"]);
        this.loader = false;
        if (res['Status']) {
          this.showSuccessfullpop(res['Status'], res['Message']['PopupHeading'], res['Message']['PopupMessage']);
          this.router.navigate(["/player/profile"]);
        } else {
          this.bsModalRef = this.modalService.show(ErrorModalComponent);
          this.loader = false;
          this.bsModalRef.content.closeBtnName = 'Close';
          this.bsModalRef.content.errorTitle = res['Message']['PopupHeading'];
          this.bsModalRef.content.errorMsg = res['Message']['PopupMessage'];
          this.playerService.indicator.next(true);
          this.bsModalRef.content.route = "/player/profile";
        }

      });

  }
  showSuccessfullpop(status, title, popmsg) {
    const initialState = {
      status: status,
      popupTitle: title,
      popupMsg: popmsg
    };

    this.bsModalRef = this.modalService.show(
      SuccessPopupComponent,
      Object.assign({}, { class: 'customModalWidth75', initialState })
    );
  }

  cancel() {
    this.router.navigate(["/player/profile"]);
  }

}
