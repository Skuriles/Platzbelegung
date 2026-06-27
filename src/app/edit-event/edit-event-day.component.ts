import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { NgFor, NgIf } from "@angular/common";
import { DateTime } from "luxon";
import { LuxonModule } from "luxon-angular";
import { ORTE } from "../classes/orte";
import { SvdEvent, Weekdays } from "../classes/svdEvent";
import { HelperService } from "../services/helper.service";

@Component({
  selector: "app-event-day",
  templateUrl: "./edit-event-day.component.html",
  styleUrls: ["./edit-event-day.component.scss"],
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatSelectModule, LuxonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEventComponent {
  public event: SvdEvent = inject(MAT_DIALOG_DATA);
  public oriEvent: SvdEvent;
  public dateFormat = "yyyy-MM-ddTHH:mm";
  public orte = ORTE;
  public weekdays = Weekdays;
  public showHint: boolean;

  private dialogRef = inject(MatDialogRef<EditEventComponent>);
  private helperService = inject(HelperService);

  constructor() {
    this.oriEvent = new SvdEvent();
    this.oriEvent.createFrom(this.event);
    this.event.editSingle = false;
    this.event.startdateStr = DateTime.fromJSDate(this.event.start).toISO();
    this.event.enddateStr = DateTime.fromJSDate(this.event.end).toISO();
    this.event.repeatsEnd = DateTime.fromJSDate(
      this.event.repeatsEndDate
    ).toISO();
  }

  toggleSelection(day: string) {
    const idx = this.event.customDays.indexOf(day);
    if (idx > -1) {
      this.event.customDays.splice(idx, 1);
    } else {
      this.event.customDays.push(day);
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
