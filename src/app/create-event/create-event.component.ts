import { Component, OnInit } from "@angular/core";
import { DateTime } from "luxon";
import { ORTE } from "../classes/orte";
import { SvdEvent } from "../classes/svdEvent";

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.scss"],
})
export class CreateEventComponent implements OnInit {
  public event: SvdEvent;
  dateFormat = "yyyy-MM-ddTHH:mm";
  public orte = ORTE;
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
