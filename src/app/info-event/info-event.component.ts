import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SvdEvent } from "../classes/svdEvent";

@Component({
  templateUrl: "./info-event.component.html",
  styleUrls: ["./info-event.component.scss"],
})
export class InfoEventComponent implements OnInit {
  public event: SvdEvent;
  constructor(@Inject(MAT_DIALOG_DATA) public data: SvdEvent) {
    this.event = data;
  }

  ngOnInit(): void {}
}
