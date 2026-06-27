import { enableProdMode, LOCALE_ID } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";

import { StartComponent } from "./app/app.component";
import { routes } from "./app/app-routing.module";
import { environment } from "./environments/environment";
import { CalendarDateFormatter, CalendarEventTitleFormatter, DateAdapter, provideCalendar } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { de } from "date-fns/locale";
import { CustomDateFormatter } from "./app/services/custom-date-formatter.service";
import { CustomEventTitleFormatterService } from "./app/services/custom-event-title-formatter.service";

registerLocaleData(localeDe);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(StartComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    { provide: MAT_DATE_LOCALE, useValue: de },
    { provide: LOCALE_ID, useValue: "de" },
    provideCalendar({ provide: DateAdapter, useFactory: adapterFactory }),
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
    { provide: CalendarEventTitleFormatter, useClass: CustomEventTitleFormatterService },
  ],
}).catch((err) => console.log(err));
