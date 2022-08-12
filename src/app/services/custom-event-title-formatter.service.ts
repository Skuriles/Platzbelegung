import { Injectable } from "@angular/core";
import { CalendarEventTitleFormatter } from "angular-calendar";
import { DateTime } from "luxon";
import { SvdEvent } from "../classes/svdEvent";

@Injectable()
export class CustomEventTitleFormatterService extends CalendarEventTitleFormatter {
  month(event: SvdEvent): string {
    let orte = "";
    const personText = event.isGame ? "Sportheimdienst" : "Verantwortlicher";
    const person = event.person ? event.person : "";
    for (const ort of event.orte) {
      orte += ort + ",";
    }
    let result = `${event.title}: ${
      event.details
    }<br>Start: ${event.startDatetime.toFormat(
      "ccc, d. MMMM yyyy - HH:mm"
    )}<br>Ende: ${event.endDatetime.toFormat("ccc, d. MMMM yyyy - HH:mm")}
    <br>Gelände: ${event.ortePhp}
    <br>${personText}: ${person}`;
    if (event.repeats || event.baseId) {
      let days = "";
      for (const day of event.customDays) {
        days += day + ",";
      }
      days = days.slice(0, -1);
      result += `<br>Wiederholendes Event, immer ${days} bis ${DateTime.fromJSDate(
        event.repeatsEndDate
      ).toFormat("ccc, d. MMMM yyyy - HH:mm")}`;
    }
    return result;
  }
}
