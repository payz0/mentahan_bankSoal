import { Component, OnInit } from '@angular/core';
// import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {

  // exportAsConfig: ExportAsConfig = {
  //   type: 'pdf', // the type you want to download
  //   elementIdOrContent: 'table', // the id of html/table element
  //   options: { // html-docx-js document options
  //     jsPDF:{
  //       orientation: 'landscape',
  //     },
  //     margins: {
  //       top: '20'
  //     }
  //   }
  // }

  constructor(){}//private exportAsService: ExportAsService) { }

  ngOnInit(): void {
  }

  // export() {
  //   // download the file using old school javascript method
  //   this.exportAsService.save(this.exportAsConfig, 'My File Name').subscribe(() => {
  //     // save started
  //   });
  //   // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
  //   this.exportAsService.get(this.exportAsConfig).subscribe(content => {
  //     console.log(content);
  //   });
  // }


}
