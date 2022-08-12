import { Component, NgZone, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DateTime, Settings } from "luxon";
import { Credentials } from "../classes/credentials";
import { Spieltag, SvdEvent } from "../classes/svdEvent";
import { TokenData } from "../classes/tokenData";
import { EditEventComponent } from "../edit-event/edit-event-day.component";
import { LoginComponent } from "../login/login.component";
import { HttpService } from "../services/http.service";
import { LoginService } from "../services/login.service";
import { MatTableDataSource } from "@angular/material/table";
import { ConfirmBoxComponent } from "../confirm-box/confirm-box.component";
import { UploadCsvComponent } from "../upload-csv/upload-csv.component";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ERoles } from "../enum/roles";
import { CreateEventComponent } from "../create-event/create-event.component";
import { InfoEventComponent } from "../info-event/info-event.component";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
  CalendarView,
} from "angular-calendar";
import { isSameDay, isSameMonth } from "date-fns";
import { CustomEventTitleFormatterService } from "../services/custom-event-title-formatter.service";
import { Subject } from "rxjs";
import { ConfirmBoxRepeatComponent } from "../confirm-box-repeat/confirm-box-repeat.component";
import { HelperService } from "../services/helper.service";

@Component({
  selector: "app-mainpage",
  templateUrl: "./mainpage.component.html",
  styleUrls: ["./mainpage.component.scss"],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatterService,
    },
  ],
})
export class MainpageComponent implements OnInit {
  public tableEvents: SvdEvent[] = [];
  public allEvents: SvdEvent[] = [];
  public view: CalendarView = CalendarView.Month;
  private editEle: SvdEvent;
  public dataSource: MatTableDataSource<SvdEvent>;
  public displayedColumns: string[] = [];
  public isMobileScreen: boolean;
  public showOldDates: boolean;
  public adminBtn: boolean;
  public viewDate: Date = new Date();
  public activeDayIsOpen = false;
  public refresh = new Subject<void>();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: "Edit",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent("Edited", event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: "Delete",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.allEvents = this.allEvents.filter((iEvent) => iEvent !== event);
        this.handleEvent("Deleted", event);
      },
    },
  ];

  constructor(
    private httpService: HttpService,
    public dialog: MatDialog,
    public loginService: LoginService,
    private breakpointObserver: BreakpointObserver,
    private ngzone: NgZone,
    private helperService: HelperService
  ) {
    Settings.defaultLocale = "de";
    breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      if (result.matches) {
        this.isMobileScreen = true;
      } else {
        this.isMobileScreen = false;
      }
      this.setGui(this.isMobileScreen);
    });
  }

  ngOnInit(): void {
    this.showOldDates = false;
    this.checkToken();
    this.setGui(this.isMobileScreen);
    this.getAllEvents();
    this.httpService.getApiInfo().subscribe((result) => {
      const i = result;
    });
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.allEvents = this.allEvents.map((iEvent) => {
      if (iEvent === event) {
        const newEvent = new SvdEvent();
        newEvent.createFrom(iEvent);
        newEvent.start = newStart;
        newEvent.end = newEnd;
        return newEvent;
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.edit(this.allEvents.find((e) => e.id === event.id));
    this.closeOpenMonthViewDay();
  }

  private getAllEvents() {
    this.dataSource = null;
    this.allEvents = [];
    this.tableEvents = [];
    this.httpService.getAllData().subscribe((result: SvdEvent[]) => {
      // set date and sort
      for (const svdEvent of result) {
        const newEvent = new SvdEvent();
        newEvent.createFrom(svdEvent);
        this.allEvents.push(newEvent);
      }
      this.httpService.getAllGames().subscribe((spieltage: Spieltag[]) => {
        // set date and sort
        for (const spiel of spieltage) {
          spiel.date = DateTime.fromSQL(spiel.datum);
          const spielEvent = Spieltag.convert(spiel);
          this.allEvents.push(spielEvent);
        }
        this.allEvents = this.allEvents.sort((a, b) => this.sortByDate(a, b));
        // loop again to set correct weekend
        for (const svdEvent of this.allEvents) {
          this.checkWeekDay(svdEvent);
        }
        this.allEvents = this.allEvents.sort((a, b) => this.sortByDate(a, b));
        this.filterEventByDate();
        this.dataSource = new MatTableDataSource<SvdEvent>(this.tableEvents);
        this.refresh.next();
        this.ngzone.run(() => {});
      });
    });
  }

  private checkWeekDay(svdEvent: SvdEvent) {
    if (!this.allEvents || this.allEvents.length === 0) {
      this.tableEvents.push(this.createWeekEndEvent(svdEvent.startDatetime));
      return;
    }
    if (this.tableEvents[this.tableEvents.length - 1]?.weekEndRow) {
      return;
    }
    if (
      svdEvent.startDatetime.weekNumber !==
      this.tableEvents[this.tableEvents.length - 1]?.startDatetime.weekNumber
    ) {
      this.tableEvents.push(this.createWeekEndEvent(svdEvent.startDatetime));
    }
  }

  private createWeekEndEvent(date: DateTime): SvdEvent {
    const newGame = new SvdEvent();
    newGame.weekEndRow = true;
    newGame.weekEndText = "KW " + date.weekNumber;
    return newGame;
  }

  public toggleDate() {
    this.showOldDates = !this.showOldDates;
    this.filterEventByDate();
  }

  private filterEventByDate() {
    this.tableEvents = [];
    for (const svdEvent of this.allEvents) {
      this.checkWeekDay(svdEvent);
      const newEvent = new SvdEvent();
      newEvent.createFrom(svdEvent);
      if (!this.showOldDates && !this.checkTodayDate(svdEvent.endDatetime)) {
        continue;
      } else {
        this.tableEvents.push(newEvent);
      }
    }
    const svdEvents = [...this.tableEvents];
    this.dataSource = new MatTableDataSource(svdEvents);
    this.dataSource.paginator = this.dataSource.paginator;
  }

  public edit(element: SvdEvent) {
    this.editEle = new SvdEvent();
    this.editEle.createFrom(element);
    const dialogRef = this.dialog.open(EditEventComponent, {
      data: this.editEle,
    });

    dialogRef.afterClosed().subscribe((result: SvdEvent) => {
      if (result) {
        if (result.delete) {
          this.delete(result);
          return;
        }
        this.saveEvent(element);
      } else {
        // nothing to do
      }
    });
  }

  public showInfo(element: SvdEvent) {
    const dialogRef = this.dialog.open(InfoEventComponent, {
      data: element,
    });
  }

  public delete(element: SvdEvent) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result: SvdEvent) => {
      if (result) {
        this.deleteEvent(element);
      }
      element.delete = false;
    });
  }

  public newEvent() {
    const dialogRef = this.dialog.open(CreateEventComponent);
    dialogRef.afterClosed().subscribe((result: SvdEvent) => {
      if (result) {
        this.addEvent(result);
      }
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public checkTodayDate(date: DateTime) {
    return date.valueOf() > DateTime.local().valueOf();
  }

  private saveEvent(element: SvdEvent) {
    const result = this.helperService.handleSaveData(element);
    if (!result) {
      return;
    }

    this.httpService.saveEvent(element).subscribe(
      (saved: boolean) => {
        if (saved) {
          this.helperService.openSnackBar("Gespeichert", "Ok");
        } else {
          this.helperService.openSnackBar(
            "Speichern fehlgeschlagen",
            "Ok",
            "errorSnack"
          );
        }
        this.getAllEvents();
      },
      (err) => {
        this.helperService.openSnackBar(
          "Speichern fehlgeschlagen",
          "Ok",
          "errorSnack"
        );
      }
    );
  }

  private addEvent(element: SvdEvent) {
    this.httpService.addEvent(element).subscribe(
      (saved: boolean) => {
        if (saved) {
          this.helperService.openSnackBar("Event angelegt", "Ok");
        } else {
          this.helperService.openSnackBar(
            "Speichern fehlgeschlagen",
            "Ok",
            "errorSnack"
          );
        }
        this.getAllEvents();
      },
      (err) => {
        this.helperService.openSnackBar(
          "Speichern fehlgeschlagen",
          "Ok",
          "errorSnack"
        );
      }
    );
  }

  private deleteEvent(event: SvdEvent) {
    if (event.repeats || event.baseId) {
      this.handleRepeateDelete(event);
      return;
    }
    this.httpService.deleteEvent(event.id as number).subscribe(
      (saved: boolean) => {
        if (saved) {
          this.helperService.openSnackBar("Gelöscht", "Ok");
        } else {
          this.helperService.openSnackBar(
            "Löschen fehlgeschlagen",
            "Ok",
            "errorSnack"
          );
        }
        this.getAllEvents();
      },
      (err) => {
        this.helperService.openSnackBar(
          "Löschen fehlgeschlagen",
          "Ok",
          "errorSnack"
        );
      }
    );
  }

  deleteAllEvents(event: SvdEvent) {
    let id = event.id;
    if (event.baseId) {
      id = event.baseId;
    }
    this.httpService.deleteAllEvent(id as number).subscribe(
      (saved: boolean) => {
        if (saved) {
          this.helperService.openSnackBar("Alle Gelöscht", "Ok");
        } else {
          this.helperService.openSnackBar(
            "Löschen fehlgeschlagen",
            "Ok",
            "errorSnack"
          );
        }
        this.getAllEvents();
      },
      (err) => {
        this.helperService.openSnackBar(
          "Löschen fehlgeschlagen",
          "Ok",
          "errorSnack"
        );
      }
    );
  }

  handleRepeateDelete(event: SvdEvent) {
    const dialogRef = this.dialog.open(ConfirmBoxRepeatComponent, {
      data: event,
    });

    dialogRef.afterClosed().subscribe((result: SvdEvent | string) => {
      if (result === "all") {
        this.deleteAllEvents(event);
      } else if (result) {
        this.deleteEvent(event);
      }
    });
  }

  public login() {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe((creds: Credentials) => {
      if (creds) {
        this.loginFromDialog(creds);
      }
    });
  }

  public upload() {
    const dialogRef = this.dialog.open(UploadCsvComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  public loginFromDialog(creds: Credentials): void {
    this.httpService.login(creds.name, creds.pw).subscribe(
      (result: TokenData) => {
        if (result && result.success) {
          this.httpService.token = result;
          sessionStorage.setItem("token", JSON.stringify(result));
          this.loginService.loggedIn = true;
          this.httpService.tokenCheck().subscribe((checkResult: any) => {
            if (checkResult.success) {
              this.httpService
                .getUserRole(checkResult.data.user.ID)
                .subscribe((info: string[]) => {
                  this.loginService.setRoles(info);
                  this.setGui(this.isMobileScreen);
                });
            } else {
              this.setGui(this.isMobileScreen);
            }
          });
        }
      },
      (err) => {
        this.helperService.openSnackBar(
          "Fehler beim Einloggen - Bitte PW und Name prüfen",
          "Verstanden",
          "errorSnack"
        );
      }
    );
  }

  private checkToken() {
    const token = sessionStorage.getItem("token");
    if (token && token !== "null") {
      this.httpService.token = JSON.parse(token) as TokenData;
      this.httpService.tokenCheck().subscribe((result: any) => {
        if (result.success) {
          this.loginService.loggedIn = true;
          this.httpService
            .getUserRole(result.data.user.ID)
            .subscribe((info: string[]) => {
              this.loginService.setRoles(info);
              this.setGui(this.isMobileScreen);
            });
        } else {
          this.setGui(this.isMobileScreen);
        }
      });
    }
  }

  public logout(): void {
    this.httpService.token = null;
    sessionStorage.setItem("token", null);
    this.loginService.loggedIn = false;
    this.setGui(this.isMobileScreen);
  }

  private sortByDate(a: SvdEvent, b: SvdEvent) {
    const aDate = a.startDatetime;
    const bDate = b.startDatetime;
    if (aDate.toMillis() < bDate.toMillis()) {
      return -1;
    }
    if (aDate.toMillis() > bDate.toMillis()) {
      return 1;
    }
    // a muss gleich b sein
    return 0;
  }

  public setGui(isMobile: boolean) {
    if (isMobile) {
      this.displayedColumns = ["datum", "datumEnd", "mannschaft", "person"];
    } else {
      this.displayedColumns = [
        "datum",
        "datumEnd",
        "mannschaft",
        "details",
        "person",
      ];
    }
    if (this.loginService.loggedIn) {
      this.displayedColumns.push("edit");
    }
    if (this.loginService.loggedIn) {
      if (this.loginService.userRole > ERoles.subscriber) {
        setTimeout(() => {
          this.adminBtn = true;
          this.displayedColumns.push("delete");
        }, 1);
        return;
      }
      if (this.loginService.userRole > ERoles.loggedOff) {
        setTimeout(() => {
          this.adminBtn = false;
        }, 1);
        return;
      }
    }
    this.adminBtn = false;
  }
}
