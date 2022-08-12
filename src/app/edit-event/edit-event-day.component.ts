import { Component, Inject, OnInit } from "@angular/core";
import { MatChip } from "@angular/material/chips";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DateTime } from "luxon";
import { ORTE } from "../classes/orte";
import { SvdEvent, Weekdays } from "../classes/svdEvent";
import { HelperService } from "../services/helper.service";

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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SvdEvent,
    public dialogRef: MatDialogRef<EditEventComponent>,
    private helperService: HelperService
  ) {
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

  delete() {
    this.event.delete = true;
    this.dialogRef.close(this.event);
  }
}
