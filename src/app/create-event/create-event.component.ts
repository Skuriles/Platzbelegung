import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
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
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.scss"],
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatSelectModule, LuxonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEventComponent {
  public event: SvdEvent;
  public dateFormat = "yyyy-MM-ddTHH:mm";
  public weekdays = Weekdays;
  public orte = ORTE;

  private dialogRef = inject(MatDialogRef<CreateEventComponent>);
  private helperService = inject(HelperService);

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
