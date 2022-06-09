import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked  {
  // title = 'sekolah';
  datas:any
  loading:boolean = false

  constructor(private _data:DataService,private cdRef:ChangeDetectorRef){
    this.datas = this._data
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges()
  }


}
