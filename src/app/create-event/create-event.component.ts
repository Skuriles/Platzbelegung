import { Component, OnInit } from "@angular/core";
import { MatChip, MatChipOption } from "@angular/material/chips";
import { MatDialogRef } from "@angular/material/dialog";
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
  constructor(
    private dialogRef: MatDialogRef<CreateEventComponent>,
    private helperService: HelperService
  ) {
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

  toggleSelection(chip: MatChipOption) {
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

  apply() {
    const result = this.helperService.handleSaveData(this.event);
    if (!result) {
      return;
    }
    this.dialogRef.close(this.event);
  }

  startDateChanged(event: string) {
    this.event.startdateStr = event;
    if (
      DateTime.fromISO(this.event.enddateStr) <
      DateTime.fromISO(this.event.startdateStr)
    ) {
      this.event.endDatetime = DateTime.fromISO(this.event.startdateStr);
      this.event.enddateStr = event;
    }
  }

  allDayChanged(event: boolean) {
    if (this.event.allDay) {
      this.event.repeats = false;
    }
  }
}
