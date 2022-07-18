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
