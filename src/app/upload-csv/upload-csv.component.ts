import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { HttpService } from "../services/http.service";

@Component({
  templateUrl: "./upload-csv.component.html",
  styleUrls: ["./upload-csv.component.scss"],
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatToolbarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadCsvComponent {
  @ViewChild("fileInput") fileInput: ElementRef;
  fileAttr = "CSV Datei wählen";
  files: File[];

  private httpService = inject(HttpService);
  private dialogRef = inject(MatDialogRef<UploadCsvComponent>);

  uploadFileEvt(csvFile: any) {
    this.files = [];
    if (csvFile.target.files && csvFile.target.files[0]) {
      this.fileAttr = "";
      Array.from(csvFile.target.files).forEach((file: File) => {
        this.fileAttr = file.name;
        this.files.push(file);
      });
      this.fileInput.nativeElement.value = "";
    } else {
      this.fileAttr = "CSV Datei wählen";
    }
  }

  public upload() {
    // this.httpService.uploadCsv(this.files).subscribe((result: any) => {
    //   if (result && result.success) {
    //     this.dialogRef.close(true);
    //   } else {
    //     this.dialogRef.close(false);
    //   }
    // });
  }
}
