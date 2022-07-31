import { CalendarEvent } from "angular-calendar";
import { EventColor, EventAction } from "calendar-utils";
import { DateTime } from "luxon";

export class SvdEvent implements CalendarEvent {
  public start: Date;
  public end?: Date;
  public title: string;
  public color?: EventColor;
  public actions?: EventAction[];
  public allDay?: boolean;
  public cssClass?: string;
  public resizable?: { beforeStart?: boolean; afterEnd?: boolean };
  public draggable?: boolean;
  public meta?: any;
  public id?: number | string;
  public name: string;
  public startdateStr: string;
  public enddateStr: string;
  public mannschaft: string;
  public details: string;
  public person: string;
  public weekEndRow: boolean;
  public weekEndText: string;

  public createFrom?(element: SvdEvent) {
    this.id = element.id;
    this.name = element.name;
    this.startdateStr = element.startdateStr;
    this.enddateStr = element.enddateStr;
    this.start = DateTime.fromSQL(element.startdateStr).toLocal().toJSDate();
    this.end = DateTime.fromSQL(element.enddateStr).toLocal().toJSDate();
    this.mannschaft = element.mannschaft;
    this.details = element.details;
    this.person = element.person;
    this.weekEndRow = element.weekEndRow;
    this.weekEndText = element.weekEndText;
  }
}

export class Spieltag {
  static convert(spieltag: Spieltag): SvdEvent {
    const event: SvdEvent = new SvdEvent();
    event.id = spieltag.id;
    event.name = "Heimspiel";
    event.startdateStr = spieltag.datum;
    event.start = DateTime.fromSQL(spieltag.datum).toLocal().toJSDate();
    event.end = DateTime.fromSQL(spieltag.datum).toLocal().toJSDate();
    event.mannschaft = spieltag.mannschaft;
    event.details = "Spiel: " + spieltag.heim + " : " + spieltag.gast;
    event.person = spieltag.person;
    event.weekEndRow = spieltag.weekEndRow;
    event.weekEndText = spieltag.weekEndText;
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
