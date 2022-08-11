import { Component, OnInit } from "@angular/core";
import { MatChip } from "@angular/material/chips";
import { DateTime } from "luxon";
import { ORTE } from "../classes/orte";
import { SvdEvent, Weekdays } from "../classes/svdEvent";
import { HelperService } from "../services/helper.service";

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.scss"],
})
export class CreateEventComponent implements OnInit {
  public event: SvdEvent;
  public dateFormat = "yyyy-MM-ddTHH:mm";
  public weekdays = Weekdays;
  public selected: MatChip[];
  public orte = ORTE;
  constructor() {
    this.event = new SvdEvent();
    this.event.start = DateTime.local().toJSDate();
    this.event.startDatetime = DateTime.local();
    this.event.startdateStr = DateTime.fromJSDate(this.event.start).toISO();
    this.event.end = DateTime.local().toJSDate();
    this.event.endDatetime = DateTime.local();
    this.event.enddateStr = DateTime.fromJSDate(this.event.end).toISO();
    this.event.repeatsEndDate = new Date();
    this.event.repeatsEnd = DateTime.fromJSDate(
      this.event.repeatsEndDate
    ).toISO();
  }

  ngOnInit(): void {}

  toggleSelection(chip: MatChip) {
    chip.toggleSelected();
    if (chip.selected) {
      this.event.customDays.push(chip.value);
    } else {
      this.event.customDays.splice(
        this.event.customDays.indexOf(chip.value),
        1
      );
    }
  }
}
