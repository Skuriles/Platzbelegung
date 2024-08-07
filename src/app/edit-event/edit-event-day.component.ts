import { Component, Inject, OnInit } from "@angular/core";
import { MatChip, MatChipOption } from "@angular/material/chips";
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
  public oriEvent: SvdEvent;
  public dateFormat = "yyyy-MM-ddTHH:mm";
  public orte = ORTE;
  public weekdays = Weekdays;
  public selected: MatChip[];
  public showHint: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SvdEvent,
    public dialogRef: MatDialogRef<EditEventComponent>,
    private helperService: HelperService
  ) {
    this.oriEvent = new SvdEvent();
    this.oriEvent.createFrom(data);
    this.event = data;
    this.event.editSingle = false;
    this.event.startdateStr = DateTime.fromJSDate(this.event.start).toISO();
    this.event.enddateStr = DateTime.fromJSDate(this.event.end).toISO();
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
    this.event.editSingle = this.showHint;
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
    this.checkRepeatDate();
  }

  endDateChanged(event: string) {
    this.event.enddateStr = event;
    this.checkRepeatDate();
  }

  private checkRepeatDate() {
    this.showHint = false;
    const end = DateTime.fromISO(this.event.enddateStr);
    const start = DateTime.fromISO(this.event.startdateStr);
    if (
      (this.event.repeats || this.event.baseId) &&
      (this.event.startDatetime.day != start.day ||
        this.event.startDatetime.month != start.month ||
        this.event.startDatetime.year != start.year ||
        this.event.endDatetime.day != end.day ||
        this.event.endDatetime.month != end.month ||
        this.event.endDatetime.year != end.year)
    ) {
      this.showHint = true;
    }
  }

  delete() {
    this.event.delete = true;
    this.dialogRef.close(this.event);
  }
}
