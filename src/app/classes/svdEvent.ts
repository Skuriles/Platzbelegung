import { CalendarEvent } from "angular-calendar";
import { EventColor, EventAction } from "calendar-utils";
import { el } from "date-fns/locale";
import { DateTime } from "luxon";
import { ORTE } from "./orte";

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
  public details: string;
  public person: string;
  public weekEndRow: boolean;
  public weekEndText: string;
  public orte: string[] = [];
  public ortePhp: string = "";
  public isGame = false;

  public createFrom?(element: SvdEvent) {
    this.id = element.id;
    this.title = element.title;
    this.startdateStr = element.startdateStr;
    this.enddateStr = element.enddateStr;
    this.start = DateTime.fromSQL(element.startdateStr).toLocal().toJSDate();
    this.end = DateTime.fromSQL(element.enddateStr).toLocal().toJSDate();
    this.startDatetime = DateTime.fromSQL(element.startdateStr).toLocal();
    this.endDatetime = DateTime.fromSQL(element.enddateStr).toLocal();
    this.details = element.details;
    this.person = element.person;
    this.weekEndRow = element.weekEndRow;
    this.weekEndText = element.weekEndText;
    this.allDay = element.allDayPhp === "1" ? true : false;
    this.allDayPhp = element.allDayPhp;
    this.orte = this.parseOrte(element.ortePhp);
    this.ortePhp = element.ortePhp;
    this.isGame = element.isGame;
  }
  parseOrte(ortePhp: string): string[] {
    ortePhp = ortePhp.replace("[", "");
    ortePhp = ortePhp.replace("]", "");
    const tokens = ortePhp.split(",");
    return tokens;
  }

  setOrte(): void {
    for (const ort of this.orte) {
      this.ortePhp += ort;
      this.ortePhp += ",";
    }
    this.ortePhp = this.ortePhp.slice(0, -1);
  }
}

export class Spieltag {
  static convert(spieltag: Spieltag): SvdEvent {
    const event: SvdEvent = new SvdEvent();
    event.id = spieltag.id;
    event.allDay = false;
    event.isGame = true;
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
    event.details = "Spiel: " + spieltag.heim + " : " + spieltag.gast;
    event.person = spieltag.person;
    event.weekEndRow = spieltag.weekEndRow;
    event.weekEndText = spieltag.weekEndText;
    event.allDay = false;
    if (spieltag.mannschaft.indexOf("SVD 3") > -1) {
      event.orte = [ORTE[1]];
    } else {
      event.orte = [ORTE[2]];
    }
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
