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
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { ConfirmBoxComponent } from "../confirm-box/confirm-box.component";
import { UploadCsvComponent } from "../upload-csv/upload-csv.component";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ERoles } from "../enum/roles";
import { CreateEventComponent } from "../create-event/create-event.component";
import { InfoEventComponent } from "../info-event/info-event.component";

@Component({
  selector: "app-mainpage",
  templateUrl: "./mainpage.component.html",
  styleUrls: ["./mainpage.component.scss"],
})
export class MainpageComponent implements OnInit {
  public svdEvents: SvdEvent[] = [];
  public allEvents: SvdEvent[] = [];
  private editEle: SvdEvent;
  public dataSource: MatTableDataSource<SvdEvent>;
  public displayedColumns: string[] = [];
  public isMobileScreen: boolean;
  public showOldDates: boolean;
  public adminBtn: boolean;
  public viewDate: Date = new Date();
  public events: [] = [];

  constructor(
    private httpService: HttpService,
    public dialog: MatDialog,
    public loginService: LoginService,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    private ngzone: NgZone
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

  private getAllEvents() {
    this.dataSource = null;
    this.svdEvents = [];
    this.allEvents = [];
    this.httpService.getAllData().subscribe((result: SvdEvent[]) => {
      // set date and sort
      for (const spiel of result) {
        spiel.date = DateTime.fromSQL(spiel.datum);
      }
      this.httpService.getAllGames().subscribe((spieltage: Spieltag[]) => {
        // set date and sort
        for (const spiel of spieltage) {
          spiel.date = DateTime.fromSQL(spiel.datum);
          const spielEvent = spiel.convert();
          result.push(spielEvent);
        }
        result = result.sort((a, b) => this.sortByDate(a, b));
        // loop again to set correct weekend
        for (const svdEvent of result) {
          this.checkWeekDay(svdEvent);
          const newEvent = new SvdEvent();
          newEvent.createFrom(svdEvent);
          this.allEvents.push(newEvent);
          this.svdEvents.push(newEvent);
        }
        result = result.sort((a, b) => this.sortByDate(a, b));
        this.filterEventByDate();
        this.dataSource = new MatTableDataSource<SvdEvent>(this.svdEvents);
        this.ngzone.run(() => {});
      });
    });
  }

  private checkWeekDay(svdEvent: SvdEvent) {
    if (!this.svdEvents || this.svdEvents.length === 0) {
      this.svdEvents.push(this.createWeekEndEvent(svdEvent.date));
      return;
    }
    if (this.svdEvents[this.svdEvents.length - 1].weekEndRow) {
      return;
    }
    if (
      svdEvent.date.weekNumber !==
      this.svdEvents[this.svdEvents.length - 1].date.weekNumber
    ) {
      this.svdEvents.push(this.createWeekEndEvent(svdEvent.date));
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
    this.svdEvents = [];
    for (const svdEvent of this.allEvents) {
      this.checkWeekDay(svdEvent);
      const newEvent = new SvdEvent();
      newEvent.createFrom(svdEvent);
      if (!this.showOldDates && !this.checkTodayDate(svdEvent.date)) {
        continue;
      } else {
        this.svdEvents.push(newEvent);
      }
    }
    const svdEvents = [...this.svdEvents];
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
        element = result;
        element.date = DateTime.fromISO(element.datum);
        element.datum = element.date.toSQL({ includeOffset: false });
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
        this.deleteEvent(element.id);
      }
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
    this.httpService.saveEvent(element).subscribe(
      (saved: boolean) => {
        if (saved) {
          this.openSnackBar("Gespeichert", "Ok");
        } else {
          this.openSnackBar("Speichern fehlgeschlagen", "Ok", "errorSnack");
        }
        this.getAllEvents();
      },
      (err) => {
        this.openSnackBar("Speichern fehlgeschlagen", "Ok", "errorSnack");
      }
    );
  }

  private addEvent(element: SvdEvent) {
    this.httpService.addEvent(element).subscribe(
      (saved: boolean) => {
        if (saved) {
          this.openSnackBar("Event angelegt", "Ok");
        } else {
          this.openSnackBar("Speichern fehlgeschlagen", "Ok", "errorSnack");
        }
        this.getAllEvents();
      },
      (err) => {
        this.openSnackBar("Speichern fehlgeschlagen", "Ok", "errorSnack");
      }
    );
  }

  private deleteEvent(id: number) {
    this.httpService.deleteEvent(id).subscribe(
      (saved: boolean) => {
        if (saved) {
          this.openSnackBar("Gelöscht", "Ok");
        } else {
          this.openSnackBar("Löschen fehlgeschlagen", "Ok", "errorSnack");
        }
        this.getAllEvents();
      },
      (err) => {
        this.openSnackBar("Löschen fehlgeschlagen", "Ok", "errorSnack");
      }
    );
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
        this.openSnackBar(
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
    if (a.date.toMillis() < b.date.toMillis()) {
      return -1;
    }
    if (a.date.toMillis() > b.date.toMillis()) {
      return 1;
    }
    // a muss gleich b sein
    return 0;
  }
  private openSnackBar(text: string, btnText: string, cssClass: string = "") {
    this.snackBar.open(text, btnText, {
      duration: 3000,
      panelClass: cssClass,
    });
  }

  public setGui(isMobile: boolean) {
    if (isMobile) {
      this.displayedColumns = ["datum", "mannschaft", "person"];
    } else {
      this.displayedColumns = ["datum", "mannschaft", "details", "person"];
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
