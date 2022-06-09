import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-input-mapel',
  templateUrl: './input-mapel.component.html',
  styleUrls: ['./input-mapel.component.css']
})
export class InputMapelComponent implements OnInit {
  mapel:any = {}
  dataMapel:any = []

  constructor(private _data:DataService) { }

  ngOnInit(): void {
    this.loadMapel()
  }

  simpan(){
    if(this.mapel.mapel){
      this._data.postData(this.mapel,'tabelMapel').subscribe(a=>{
        this._data.info("Mapel "+this.mapel.mapel+" di tambahkan")
        this.dataMapel.push(a)
        this.mapel = {}
      })
    }else{
      this._data.info("data harus di isi dulu")
    }
  }

  loadMapel(){
    this._data.loading = true
    this._data.getData('tabelMapel').subscribe(a=>{
      this.dataMapel = this._data.sortAsc(a,'tingkat')
      this._data.loading = false
    })
  }

  deleted(id:string){
    let i = this.dataMapel.findIndex((a:any)=>{return a._id == id})
    this._data.deleteData("tabelMapel",id).subscribe(a=>{
      this.dataMapel.splice(i,1)
      this._data.info("Mapel sudhah di hapus")
    })
  }

  sortMapel(mapel:string){
    this._data.sortAsc(this.dataMapel,mapel)
  }
}
