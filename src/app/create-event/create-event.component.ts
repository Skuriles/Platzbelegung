import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DateTime } from "luxon";
import { SvdEvent } from "../classes/svdEvent";

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.scss"],
})
export class CreateEventComponent implements OnInit {
  public event: SvdEvent;
  constructor() {
    this.event = new SvdEvent();
    this.event.date = DateTime.local();
    this.event.datum = this.event.date.toISO();
  }

  ngOnInit(): void {}
}
