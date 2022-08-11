import { Component, Inject, OnInit } from "@angular/core";
import { MatChip } from "@angular/material/chips";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DateTime } from "luxon";
import { ORTE } from "../classes/orte";
import { SvdEvent, Weekdays } from "../classes/svdEvent";

@Component({
  selector: "app-event-day",
  templateUrl: "./edit-event-day.component.html",
  styleUrls: ["./edit-event-day.component.scss"],
})
export class EditEventComponent implements OnInit {
  public event: SvdEvent;
  public dateFormat = "yyyy-MM-ddTHH:mm";
  public orte = ORTE;
  public weekdays = Weekdays;
  public selected: MatChip[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: SvdEvent) {
    this.event = data;
    this.event.startdateStr = DateTime.fromJSDate(this.event.start).toISO();
    this.event.enddateStr = DateTime.fromJSDate(this.event.end).toISO();
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
