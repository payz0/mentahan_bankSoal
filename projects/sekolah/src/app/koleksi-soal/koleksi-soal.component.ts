import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DaftarSoalComponent } from '../daftar-soal/daftar-soal.component';
import { DataService } from '../data.service';

@Component({
  selector: 'app-koleksi-soal',
  templateUrl: './koleksi-soal.component.html',
  styleUrls: ['./koleksi-soal.component.css']
})
export class KoleksiSoalComponent implements OnInit {
  dataMapel:any
  infoBox:boolean = false
  folder:any = {}
  koleksi:any = {}
  showSide:boolean = false
  arrayCollect:any = []//= [{'nama_koleksi':'ulangan'}]
  indexs:number = -1
  selectSoal:any = []
  dataSoal:any = []
  editNama:boolean = false
  indx:number = -1
  @ViewChild(DaftarSoalComponent) child: any;

  constructor(private _data:DataService, private router:Router) { }

  ngAfterViewInit() {
    if(!this.selectSoal){
        this.selectSoal ? this.child.selectSoal : this.selectSoal
    }
  }

  ngOnInit(): void {
    this.loadMapel()
    // console.log(this.selectSoal);

  }

  loadMapel(){
    this._data.loading = true
    this._data.getData('tabelNgajar&id_guru&'+sessionStorage.getItem('id_guru')).subscribe(a=>{
      this.dataMapel = a
      this.folder.mapel = this.dataMapel[0].mapel
    })

    this._data.getData('tabelKoleksiSoal&id_guru&'+sessionStorage.getItem('id_guru')).subscribe(x=>{
      this.arrayCollect = x
      this._data.loading = false
    })
  }

  simpan(){
    this.folder.tgl = new Date()
    this.arrayCollect.push(this.folder)
    this.infoBox = false
    this.folder = {}
    console.log(this.folder);

  }

  enter(a:any){
    this.koleksi = a
    console.log(this.selectSoal);
    this.simpanDaftar()

  }

  simpanDaftar(){
    this.koleksi.tgl = new Date()
    this.koleksi.id_guru = sessionStorage.getItem('id_guru')
    if(this.selectSoal.length){
      this.koleksi.daftar_soal = this.selectSoal.join(",")
    }
    this._data.postData(this.koleksi,'tabelKoleksiSoal').subscribe(a=>{
      this._data.info("Soal tersimpan")
    })
  }

  showSoal(i:number,data:any){
    this.showSide = !this.showSide
    this.indexs = i
    this.koleksi = data
    if(!this.showSide){
      this.simpanDaftar()
      console.log(this.koleksi);
    }else{
      this.selectSoal = this.arrayCollect[i].daftar_soal ? this.arrayCollect[i].daftar_soal.split(',') : this.selectSoal
    }
  }

  preview(id_koleksi:string){
    this._data._id = id_koleksi
    this.router.navigate(['/dashboard/ujian'])
  }

  editFolder(id:number){
    this.indx = id
    this.editNama = !this.editNama
  }

  deleteFolder(id:any){
    this._data.deleteData('tabelKoleksiSoal',id).subscribe((a:any)=>{
      this.arrayCollect.splice(this.arrayCollect.findIndex((b:any)=>{return b._id == a._id}),1)
      this._data.info('Folder di hapus')
    })
  }
}


