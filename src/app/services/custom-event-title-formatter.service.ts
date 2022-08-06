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
    return `${event.title}: ${
      event.details
    }<br>Start: ${event.startDatetime.toFormat(
      "ccc, d. MMMM yyyy - HH:mm"
    )}<br>Ende: ${event.endDatetime.toFormat("ccc, d. MMMM yyyy - HH:mm")}
    <br>Gelände: ${event.ortePhp}
    <br>${personText}: ${person}`;
  }
}
