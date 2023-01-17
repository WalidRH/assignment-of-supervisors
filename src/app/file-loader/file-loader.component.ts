import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css'],
})
export class FileLoaderComponent implements OnInit {
  @Output('fileLoader') fileLoader = new EventEmitter<any>();

  ngOnInit(): void {}

  exceltoJson = {};

  onFileChange(event: any) {
    this.exceltoJson = {};
    let headerJson = {};
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>event.target;
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    console.log('filename', target.files[0].name);
    this.exceltoJson['filename'] = target.files[0].name;
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      for (var i = 0; i < wb.SheetNames.length; ++i) {
        const wsname: string = wb.SheetNames[i];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
        this.exceltoJson[`sheet${i + 1}`] = data;
        const headers = this.get_header_row(ws);
        headerJson[`header${i + 1}`] = headers;
        //  console.log("json",headers)
      }
      this.exceltoJson['headers'] = headerJson;
      this.fileLoader.emit(this.exceltoJson);
    };
  }

  get_header_row(sheet) {
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C,
      R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
      var cell =
        sheet[
          XLSX.utils.encode_cell({ c: C, r: R })
        ]; /* find the cell in the first row */
      // console.log("cell",cell)
      var hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
      if (cell && cell.t) {
        hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
    }
    return headers;
  }
}
