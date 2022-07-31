import { CalendarEvent } from "angular-calendar";
import { EventColor, EventAction } from "calendar-utils";
import { DateTime } from "luxon";

export class SvdEvent implements CalendarEvent {
  public start: Date;
  public end?: Date;
  public startDatetime: DateTime;
  public endDatetime: DateTime;
  public title: string;
  public color?: EventColor;
  public actions?: EventAction[];
  public allDay?: boolean;
  public allDayPhp?: string;
  public cssClass?: string;
  public resizable?: { beforeStart?: boolean; afterEnd?: boolean };
  public draggable?: boolean;
  public meta?: any;
  public id?: number | string;
  public startdateStr: string;
  public enddateStr: string;
  public mannschaft: string;
  public details: string;
  public person: string;
  public weekEndRow: boolean;
  public weekEndText: string;

  public createFrom?(element: SvdEvent) {
    this.id = element.id;
    this.title = element.title;
    this.startdateStr = element.startdateStr;
    this.enddateStr = element.enddateStr;
    this.start = DateTime.fromSQL(element.startdateStr).toLocal().toJSDate();
    this.end = DateTime.fromSQL(element.enddateStr).toLocal().toJSDate();
    this.startDatetime = DateTime.fromSQL(element.startdateStr).toLocal();
    this.endDatetime = DateTime.fromSQL(element.enddateStr).toLocal();
    this.mannschaft = element.mannschaft;
    this.details = element.details;
    this.person = element.person;
    this.weekEndRow = element.weekEndRow;
    this.weekEndText = element.weekEndText;
    this.allDay = element.allDayPhp === "1" ? true : false;
    this.allDayPhp = element.allDayPhp;
  }
}

export class Spieltag {
  static convert(spieltag: Spieltag): SvdEvent {
    const event: SvdEvent = new SvdEvent();
    event.id = spieltag.id;
    event.title = "Heimspiel";
    event.startdateStr = spieltag.datum;
    event.start = DateTime.fromSQL(spieltag.datum).toLocal().toJSDate();
    event.end = DateTime.fromSQL(spieltag.datum).toLocal().toJSDate();
    event.startDatetime = DateTime.fromSQL(spieltag.datum).toLocal();
    event.endDatetime = DateTime.fromSQL(spieltag.datum)
      .toLocal()
      .plus({ hours: 2 });
    event.enddateStr = event.endDatetime.toSQL({
      includeOffset: false,
    });
    event.mannschaft = spieltag.mannschaft;
    event.details = "Spiel: " + spieltag.heim + " : " + spieltag.gast;
    event.person = spieltag.person;
    event.weekEndRow = spieltag.weekEndRow;
    event.weekEndText = spieltag.weekEndText;
    event.allDay = false;
    return event;
  }

  public id: number;
  public date: DateTime;
  public datum: string;
  public mannschaft: string;
  public heim: string;
  public gast: string;
  public person: string;
  public weekEndRow: boolean;
  public weekEndText: string;
  public mannschaftShort: string;

  public createFrom(element: Spieltag) {
    this.id = element.id;
    this.datum = element.datum;
    this.date = DateTime.fromSQL(element.datum).toLocal();
    this.mannschaft = element.mannschaft;
    this.heim = element.heim;
    this.gast = element.gast;
    this.person = element.person;
    this.weekEndRow = element.weekEndRow;
    this.weekEndText = element.weekEndText;
    this.mannschaftShort = this.createShortStr(element.mannschaft);
  }

  public createShortStr(mannschaft: string): string {
    const tokens = mannschaft.split("-");
    return tokens[0];
  }
}
