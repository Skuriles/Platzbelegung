import { DateTime } from "luxon";

export class SvdEvent {
  public id: number;
  public name: string;
  public date: DateTime;
  public datum: string;
  public mannschaft: string;
  public details: string;
  public person: string;
  public weekEndRow: boolean;
  public weekEndText: string;

  public createFrom(element: SvdEvent) {
    this.id = element.id;
    this.name = element.name;
    this.datum = element.datum;
    this.date = DateTime.fromSQL(element.datum).toLocal();
    this.mannschaft = element.mannschaft;
    this.details = element.details;
    this.person = element.person;
    this.weekEndRow = element.weekEndRow;
    this.weekEndText = element.weekEndText;
  }
}

export class Spieltag {
  convert(): SvdEvent {
    const event: SvdEvent = new SvdEvent();
    event.id = this.id;
    event.name = "Heimspiel";
    event.datum = this.datum;
    event.date = DateTime.fromSQL(this.datum).toLocal();
    event.mannschaft = this.mannschaft;
    event.details = "Spiel: " + this.heim + " : " + this.gast;
    event.person = this.person;
    event.weekEndRow = this.weekEndRow;
    event.weekEndText = this.weekEndText;
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
