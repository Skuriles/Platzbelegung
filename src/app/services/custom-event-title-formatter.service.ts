import { Injectable } from "@angular/core";
import { CalendarEventTitleFormatter } from "angular-calendar";
import { DateTime } from "luxon";
import { SvdEvent } from "../classes/svdEvent";

@Injectable()
export class CustomEventTitleFormatterService extends CalendarEventTitleFormatter {
  month(event: SvdEvent): string {
    return `${event.title}: ${
      event.details
    }<br>Start: ${event.startDatetime.toFormat(
      "ccc, d. MMMM yyyy - HH:mm"
    )}<br>Ende: ${event.endDatetime.toFormat("ccc, d. MMMM yyyy - HH:mm")}`;
  }
}
