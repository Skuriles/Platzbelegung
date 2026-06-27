import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { LuxonModule } from "luxon-angular";
import { DateTime } from "luxon";
import { SvdEvent } from "../classes/svdEvent";

@Component({
  templateUrl: "./info-event.component.html",
  styleUrls: ["./info-event.component.scss"],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatTableModule, LuxonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoEventComponent {
  public event: SvdEvent = inject(MAT_DIALOG_DATA);
  public datasource: { info; value }[];

  constructor() {
    this.transform();
  }

  transform() {
    const list: { info; value }[] = [];
    let listItem = { info: "Titel", value: this.event.title };
    list.push(listItem);
    listItem = { info: "Details", value: this.event.details };
    list.push(listItem);
    listItem = {
      info: "Start",
      value: this.event.startDatetime.toFormat("dd.MM - HH:mm"),
    };
    list.push(listItem);
    listItem = {
      info: "Ende",
      value: this.event.endDatetime.toFormat("dd.MM - HH:mm"),
    };
    list.push(listItem);
    listItem = { info: "Verantwortlicher", value: this.event.person };
    list.push(listItem);
    listItem = {
      info: "Wiederholt sich",
      value: this.event.repeats || this.event.baseId ? "Ja" : "Nein",
    };
    list.push(listItem);
    if (this.event.repeats || this.event.baseId) {
      let customDaysStr: string = "";
      for (const day of this.event.customDays) {
        customDaysStr += day + ",";
      }
      customDaysStr +=
        " bis " +
        DateTime.fromJSDate(this.event.repeatsEndDate).toFormat("dd.MM.");
      listItem = { info: "immer am", value: customDaysStr };
      list.push(listItem);
    }
    let orte: string = "";
    for (const ort of this.event.orte) {
      orte += ort + ",";
    }
    listItem = { info: "Nutzung", value: orte };
    list.push(listItem);
    this.datasource = list;
  }

  displayedColumns = ["info", "wert"];
}
