import { Injectable } from "@angular/core";
import { CalendarEventTitleFormatter } from "angular-calendar";
import { DateTime } from "luxon";
import { SvdEvent } from "../classes/svdEvent";

@Injectable()
export class CustomEventTitleFormatterService extends CalendarEventTitleFormatter {
  month(event: SvdEvent): string {
    let orte = "";
    const format = event.allDay
      ? "ccc, d. MMMM yyyy"
      : "ccc, d. MMMM yyyy - HH:mm";
    const personText = event.isGame ? "Sportheimdienst" : "Verantwortlicher";
    const person = event.person ? event.person : "";
    for (const ort of event.orte) {
      orte += ort + ",";
    }
    let result = `${event.title}: ${
      event.details
    }<br>Start: ${event.startDatetime.toFormat(
      format
    )}<br>Ende: ${event.endDatetime.toFormat(format)}
    <br>Gelände: ${event.orte}
    <br>${personText}: ${person}`;
    if (event.repeats || event.baseId) {
      let days = "";
      for (const day of event.customDays) {
        days += day + ",";
      }
      days = days.slice(0, -1);
      result += `<br>Wiederholendes Event, immer ${days} bis ${DateTime.fromJSDate(
        event.repeatsEndDate
      ).toFormat(format)}`;
    }
    if (event.allDay) {
      result += "<br>Ganztagsevent!";
    }
    return result;
  }
}
