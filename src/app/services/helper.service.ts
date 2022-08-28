import { Injectable } from "@angular/core";
import { DateTime } from "luxon";
import { SvdEvent } from "../classes/svdEvent";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class HelperService {
  constructor(private snackBar: MatSnackBar) {}

  handleSaveData(element: SvdEvent): boolean {
    if (element.allDay) {
      element.startDatetime = DateTime.fromJSDate(element.start);
      element.startdateStr = element.startDatetime.toSQL({
        includeOffset: false,
      });
      element.endDatetime = DateTime.fromJSDate(element.end);
      element.enddateStr = element.endDatetime.toSQL({
        includeOffset: false,
      });
    } else {
      element.start = DateTime.fromISO(element.startdateStr).toJSDate();
      element.startDatetime = DateTime.fromISO(element.startdateStr);
      element.startdateStr = DateTime.fromJSDate(element.start).toSQL({
        includeOffset: false,
      });
      element.end = DateTime.fromISO(element.enddateStr).toJSDate();
      element.endDatetime = DateTime.fromISO(element.enddateStr);
      element.enddateStr = DateTime.fromJSDate(element.end).toSQL({
        includeOffset: false,
      });
    }
    element.allDayPhp = element.allDay ? "1" : "0";
    element.repeatsPhp = element.repeats ? "1" : "0";
    element.ortePhp = element.setTokens(element.orte);
    element.customDaysPhp = element.setTokens(element.customDays);
    element.repeatsEnd = DateTime.fromJSDate(element.repeatsEndDate).toSQL({
      includeOffset: false,
    });
    if (element.repeats) {
      element.repeatsEnd = DateTime.fromJSDate(element.repeatsEndDate).toSQL({
        includeOffset: false,
      });
    }
    let result = 0;
    if (element.startDatetime >= element.endDatetime) {
      if (element.allDay && element.startDatetime.equals(element.endDatetime)) {
        result = 0;
      } else {
        result = 1;
      }
    }
    if (
      !element.title ||
      !element.person ||
      !element.start ||
      !element.end ||
      !element.orte ||
      element.orte.length === 0
    ) {
      result = 2;
    }
    if (
      !element.allDay &&
      element.endDatetime.day > element.startDatetime.day
    ) {
      result = 3;
    }
    switch (result) {
      case 1:
        this.openSnackBar(
          "Kann nicht speichern - Startdatum vor Enddatum",
          "Ok",
          "errorSnack",
          5000
        );
        return false;
      case 2:
        this.openSnackBar(
          "Kann nicht speichern - Titel, Verantwortlicher, Start und Ende und Gelände müssen angegeben sein",
          "Ok",
          "errorSnack",
          5000
        );
        return false;
      case 3:
        this.openSnackBar(
          "Kann nicht speichern - Event endet nicht am selben Tag. Nutze Ganztages Event oder ändere Datum",
          "Ok",
          "errorSnack",
          5000
        );
        return false;
      default:
        return true;
    }
  }

  openSnackBar(
    text: string,
    btnText: string,
    cssClass: string = "",
    duration = 3000
  ) {
    this.snackBar.open(text, btnText, {
      duration,
      panelClass: cssClass,
    });
  }
}
