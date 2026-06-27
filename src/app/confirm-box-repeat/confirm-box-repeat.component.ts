import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { SvdEvent } from "../classes/svdEvent";

@Component({
  selector: "app-confirm-box-repeat",
  templateUrl: "./confirm-box-repeat.component.html",
  styleUrls: ["./confirm-box-repeat.component.scss"],
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmBoxRepeatComponent {
  public event: SvdEvent = inject(MAT_DIALOG_DATA);
  public edit = false;
}
