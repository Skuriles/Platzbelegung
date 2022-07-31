import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DateTime } from "luxon";
import { SvdEvent } from "../classes/svdEvent";

@Component({
  selector: "app-event-day",
  templateUrl: "./edit-event-day.component.html",
  styleUrls: ["./edit-event-day.component.scss"],
})
export class EditEventComponent implements OnInit {
  public event: SvdEvent;
  constructor(@Inject(MAT_DIALOG_DATA) public data: SvdEvent) {
    this.event = data;
    this.event.startdateStr = DateTime.fromJSDate(this.event.start).toISO();
  }

  ngOnInit(): void {}
}
