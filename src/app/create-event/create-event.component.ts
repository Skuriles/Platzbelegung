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
    this.event.start = DateTime.local().toJSDate();
    this.event.startDatetime = DateTime.local();
    this.event.startdateStr = DateTime.fromJSDate(this.event.start).toISO();
    this.event.end = DateTime.local().toJSDate();
    this.event.endDatetime = DateTime.local();
    this.event.enddateStr = DateTime.fromJSDate(this.event.end).toISO();
  }

  ngOnInit(): void {}
}
