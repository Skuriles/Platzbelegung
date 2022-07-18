import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainpageComponent } from "./mainpage/mainpage.component";

const routes: Routes = [
  { path: "", component: MainpageComponent },
  {
    path: "main",
    component: MainpageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
