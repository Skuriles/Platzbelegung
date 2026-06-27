import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SvdEvent } from "../classes/svdEvent";

@Component({
  selector: "app-confirm-box",
  templateUrl: "./confirm-box.component.html",
  styleUrls: ["./confirm-box.component.scss"],
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmBoxComponent {
  public event: SvdEvent = inject(MAT_DIALOG_DATA);
}
