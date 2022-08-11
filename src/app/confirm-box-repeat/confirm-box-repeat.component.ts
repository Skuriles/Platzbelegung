import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SvdEvent } from "../classes/svdEvent";

@Component({
  selector: "app-confirm-box-repeat",
  templateUrl: "./confirm-box-repeat.component.html",
  styleUrls: ["./confirm-box-repeat.component.scss"],
})
export class ConfirmBoxRepeatComponent implements OnInit {
  public event: SvdEvent;
  constructor(@Inject(MAT_DIALOG_DATA) public data: SvdEvent) {
    this.event = data;
  }

  ngOnInit(): void {}
}
