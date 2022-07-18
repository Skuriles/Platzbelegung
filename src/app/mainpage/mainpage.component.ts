import { Component, NgZone, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DateTime, Settings } from "luxon";
import { Credentials } from "../classes/credentials";
import { Spieltag } from "../classes/spieltag";
import { TokenData } from "../classes/tokenData";
import { EditMatchDayComponent } from "../edit-match-day/edit-match-day.component";
import { LoginComponent } from "../login/login.component";
import { HttpService } from "../services/http.service";
import { LoginService } from "../services/login.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { ConfirmBoxComponent } from "../confirm-box/confirm-box.component";
import { CreateGameComponent } from "../create-game/create-game.component";
import { UploadCsvComponent } from "../upload-csv/upload-csv.component";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { InfoGameComponent } from "../info-game/info-game.component";
import { ERoles } from "../enum/roles";

@Component({
  selector: "app-mainpage",
  templateUrl: "./mainpage.component.html",
  styleUrls: ["./mainpage.component.css"],
})
export class MainpageComponent implements OnInit {
  public spiele: Spieltag[] = [];
  public allGames: Spieltag[] = [];
  private editEle: Spieltag;
  public dataSource: MatTableDataSource<Spieltag>;
  public displayedColumns: string[] = [];
  public isMobileScreen: boolean;
  public showOldDates: boolean;
  public adminBtn: boolean;

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
    this.getAllGames();
    this.httpService.getApiInfo().subscribe((result) => {
      const i = result;
    });
  }

  private getAllGames() {
    this.dataSource = null;
    this.spiele = [];
    this.allGames = [];
    this.httpService.getAllData().subscribe((result: Spieltag[]) => {
      // set date and sort
      for (const spiel of result) {
        spiel.date = DateTime.fromSQL(spiel.datum);
      }
      result = result.sort((a, b) => this.sortByDate(a, b));
      // loop again to set correct weekend
      for (const spiel of result) {
        this.checkWeekDay(spiel);
        const newGame = new Spieltag();
        newGame.createFrom(spiel);
        this.allGames.push(newGame);
        this.spiele.push(newGame);
      }
      this.filterGamesByDate();
      this.dataSource = new MatTableDataSource<Spieltag>(this.spiele);
      this.ngzone.run(() => {});
    });
  }

  private checkWeekDay(spiel: Spieltag) {
    if (!this.spiele || this.spiele.length === 0) {
      this.spiele.push(this.createWeekEndGame(spiel.date));
      return;
    }
    if (this.spiele[this.spiele.length - 1].weekEndRow) {
      return;
    }
    if (
      spiel.date.weekNumber !==
      this.spiele[this.spiele.length - 1].date.weekNumber
    ) {
      this.spiele.push(this.createWeekEndGame(spiel.date));
    }
  }

  private createWeekEndGame(date: DateTime): Spieltag {
    const newGame = new Spieltag();
    newGame.weekEndRow = true;
    newGame.weekEndText = "KW " + date.weekNumber;
    return newGame;
  }

  public toggleDate() {
    this.showOldDates = !this.showOldDates;
    this.filterGamesByDate();
  }

  private filterGamesByDate() {
    this.spiele = [];
    for (const game of this.allGames) {
      this.checkWeekDay(game);
      const newGame = new Spieltag();
      newGame.createFrom(game);
      if (!this.showOldDates && !this.checkTodayDate(game.date)) {
        continue;
      } else {
        this.spiele.push(newGame);
      }
    }
    const games = [...this.spiele];
    this.dataSource = new MatTableDataSource(games);
    this.dataSource.paginator = this.dataSource.paginator;
  }

  public edit(element: Spieltag) {
    this.editEle = new Spieltag();
    this.editEle.createFrom(element);
    const dialogRef = this.dialog.open(EditMatchDayComponent, {
      data: this.editEle,
    });

    dialogRef.afterClosed().subscribe((result: Spieltag) => {
      if (result) {
        element = result;
        element.date = DateTime.fromISO(element.datum);
        element.datum = element.date.toSQL({ includeOffset: false });
        this.saveGame(element);
      } else {
        // nothing to do
      }
    });
  }

  public showInfo(element: Spieltag) {
    const dialogRef = this.dialog.open(InfoGameComponent, {
      data: element,
    });
  }

  public delete(element: Spieltag) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result: Spieltag) => {
      if (result) {
        this.deleteGame(element.id);
      }
    });
  }

  public newGame() {
    const dialogRef = this.dialog.open(CreateGameComponent);
    dialogRef.afterClosed().subscribe((result: Spieltag) => {
      if (result) {
        this.addGame(result);
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

  private saveGame(element: Spieltag) {
    this.httpService.saveGame(element).subscribe(
      (saved: boolean) => {
        if (saved) {
          this.openSnackBar("Gespeichert", "Ok");
        } else {
          this.openSnackBar("Speichern fehlgeschlagen", "Ok", "errorSnack");
        }
        this.getAllGames();
      },
      (err) => {
        this.openSnackBar("Speichern fehlgeschlagen", "Ok", "errorSnack");
      }
    );
  }

  private addGame(element: Spieltag) {
    this.httpService.addGame(element).subscribe(
      (saved: boolean) => {
        if (saved) {
          this.openSnackBar("Spiel angelegt", "Ok");
        } else {
          this.openSnackBar("Speichern fehlgeschlagen", "Ok", "errorSnack");
        }
        this.getAllGames();
      },
      (err) => {
        this.openSnackBar("Speichern fehlgeschlagen", "Ok", "errorSnack");
      }
    );
  }

  private deleteGame(id: number) {
    this.httpService.deleteGame(id).subscribe(
      (saved: boolean) => {
        if (saved) {
          this.openSnackBar("Gelöscht", "Ok");
        } else {
          this.openSnackBar("Löschen fehlgeschlagen", "Ok", "errorSnack");
        }
        this.getAllGames();
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

  private sortByDate(a: Spieltag, b: Spieltag) {
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
      this.displayedColumns = ["datum", "mannschaft", "heim", "gast", "person"];
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
