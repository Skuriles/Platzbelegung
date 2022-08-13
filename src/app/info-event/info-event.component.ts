import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { DateTime } from "luxon";
import { SvdEvent } from "../classes/svdEvent";

@Component({
  templateUrl: "./info-event.component.html",
  styleUrls: ["./info-event.component.scss"],
})
export class InfoEventComponent implements OnInit {
  public event: SvdEvent;
  public datasource: { info; value }[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: SvdEvent) {
    this.event = data;
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

  ngOnInit(): void {}
}

// <span *ngIf="!element.weekEndRow && !isMobileScreen && !element.allDay">
// {{
//   element.startDatetime
//     | dateTimeToFormat: "ccc, d. MMMM yyyy - HH:mm"
// }}
// Uhr
// </span>
// <span *ngIf="!element.weekEndRow && isMobileScreen && !element.allDay">
// {{ element.startDatetime | dateTimeToFormat: "dd.MM - HH:mm" }}
// </span>
// <span *ngIf="!element.weekEndRow && element.allDay">
// {{ element.startDatetime | dateTimeToFormat: "dd.MM" }} - Ganztag
// </span>
