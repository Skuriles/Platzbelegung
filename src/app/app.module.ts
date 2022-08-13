import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";

import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatToolbarModule } from "@angular/material/toolbar";
import { LayoutModule } from "@angular/cdk/layout";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

import { StartComponent } from "./app.component";

import { LoginComponent } from "./login/login.component";
import { HttpService } from "./services/http.service";
import { MainpageComponent } from "./mainpage/mainpage.component";
import { EditEventComponent } from "./edit-event/edit-event-day.component";
import { LoginService } from "./services/login.service";
import { LuxonModule } from "luxon-angular";
import { ConfirmBoxComponent } from "./confirm-box/confirm-box.component";
import { CreateEventComponent } from "./create-event/create-event.component";
import { UploadCsvComponent } from "./upload-csv/upload-csv.component";
import { InfoEventComponent } from "./info-event/info-event.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import {
  CalendarDateFormatter,
  CalendarModule,
  DateAdapter,
  CalendarEventTitleFormatter,
} from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDateFnsModule } from "@angular/material-date-fns-adapter";
import { de } from "date-fns/locale";
import { ConfirmBoxRepeatComponent } from "./confirm-box-repeat/confirm-box-repeat.component";
import { CustomDateFormatter } from "./services/custom-date-formatter.service";

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    StartComponent,
    LoginComponent,
    MainpageComponent,
    EditEventComponent,
    ConfirmBoxComponent,
    CreateEventComponent,
    UploadCsvComponent,
    InfoEventComponent,
    ConfirmBoxRepeatComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    AppRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule,
    HttpClientModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDateFnsModule,
    MatCheckboxModule,
    LuxonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatChipsModule,
    MatButtonToggleModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    HttpService,
    LoginService,
    { provide: MAT_DATE_LOCALE, useValue: de },
    CalendarEventTitleFormatter,
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
  ],
  bootstrap: [StartComponent],
})
export class AppModule {}
