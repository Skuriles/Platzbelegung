import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";

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
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    FormsModule,
    NoopAnimationsModule,
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
    LuxonModule,
  ],
  providers: [HttpService, LoginService],
  bootstrap: [StartComponent],
})
export class AppModule {}
