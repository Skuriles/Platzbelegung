import { Component, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { HttpService } from "../services/http.service";

@Component({
  templateUrl: "./upload-csv.component.html",
  styleUrls: ["./upload-csv.component.scss"],
})
export class UploadCsvComponent {
  @ViewChild("fileInput") fileInput: ElementRef;
  fileAttr = "CSV Datei wählen";
  files: File[];

  constructor(
    private httpService: HttpService,
    private dialogRef: MatDialogRef<UploadCsvComponent>
  ) {}

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
