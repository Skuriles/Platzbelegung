import { Injectable } from "@angular/core";
import {
  CalendarNativeDateFormatter,
  DateFormatterParams,
} from "angular-calendar";

@Injectable()
export class CustomDateFormatter extends CalendarNativeDateFormatter {
  public dayViewHour({ date, locale }: DateFormatterParams): string {
    // change this to return a different date format
    return new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(date);
  }
}
