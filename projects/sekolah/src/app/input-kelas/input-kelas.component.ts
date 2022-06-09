import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-input-kelas',
  templateUrl: './input-kelas.component.html',
  styleUrls: ['./input-kelas.component.css']
})
export class InputKelasComponent implements OnInit {
  kelas:any = {}
  dataKelas:any
  dataSiswa:any
  showSiswa:boolean = false
  nama_kelas:string = ''
  arraySiswa:any = []
  sorter:boolean = true
  cari:any
  total:number = 0
  sisa:number = 0
  limit:number = 10
  limitBayangan:number = 10
  hal:number = 1
  skip:number = 0
  allSiswa:any
  constructor(private _data:DataService) { }

  ngOnInit(): void {
    this.loadKelas()
  }

  simpan(){
    console.log( this.kelas );
    this._data.postData(this.kelas,'tabelKelas').subscribe(a=>{
      let i = this.dataKelas.findIndex((b:any)=>{return b._id == a._id})
      if(i == -1){
        this.dataKelas.push(a)
      }else{
        this.dataKelas[i] = a
      }
      this.kelas = {}
      this._data.info("Data ditambahkan")
    })
  }

  loadKelas(){
    this._data.loading = true
    this._data.getData('tabelKelas').subscribe((b:any)=>{
      // console.log(b);

      this._data.getData("tabelSiswa&status&aktif").subscribe((c:any)=>{
        this.allSiswa = c
        this.dataSiswa = c.slice(this.skip,this.limit)
        b.forEach((key:any,i:number) => {
          b[i].jumlah = c.filter((a:any)=>{return a.kelas == key.kelas}).length
          if(b.length == i+1){
            this._data.loading = false
            // this.loadSoalSendiri()
          }
        });
      })
      this.dataKelas = this._data.sortAsc(b,'kelas')
    })
  }

  loadSiswa(kelas:string){
    this.nama_kelas = kelas
    let siswa = this.allSiswa.filter((sis:any)=>{return sis.kelas == kelas || sis.kelas == null})
    this.dataSiswa = this._data.sortAsc(siswa.slice(this.skip,this.limit),'nama_siswa')
    this.sisa = Math.ceil(siswa.length / this.limitBayangan)
    this.total = siswa.length
    this.showSiswa = true//!this.showSiswa
    console.log(kelas);

  }

  simpanSiswaKelas(){
    for(let i = 0; this.arraySiswa.length > i; i++){
      this._data.updateData("tabelSiswa",{"_id":this.arraySiswa[i],"kelas":this.nama_kelas}).subscribe((a:any)=>{
        this._data.info("Updata data "+ this.nama_kelas)
        this.showSiswa = false
      })
      if(this.arraySiswa.length == i+1){
        this.loadKelas()
      }
    }

  }

  cekboxData(e:any){
      let i = this.arraySiswa.indexOf(e.target.value)
    if(this.arraySiswa.indexOf(e.target.value ) == -1){
      this.arraySiswa.push(e.target.value)
    }else{
      this.arraySiswa.splice(i,1)
    }

  }

  urutan(arr:any,ob:string){
    this.sorter = !this.sorter
    if(this.sorter){
      this._data.sortAsc(arr,ob)
    }else{
      this._data.sortDesc(arr,ob)
    }
  }

  reset(){
        this.limitBayangan = 10
        this.hal = 1;
        this.skip = 0;
        this.limit = 1 * this.limitBayangan;

        this.dataSiswa = this.allSiswa.slice(this.skip,this.limit)
        this.total = this.allSiswa.length
        this.sisa = Math.ceil(this.allSiswa.length / this.limitBayangan)
  }

  gantiLimit(){
    this.skip = 0
    this.hal = 1
    this.limit = 1 * this.limitBayangan
    // this.loadSoalSendiri()
    this.loadSiswa(this.nama_kelas)
    console.log(this.hal,this.skip,this.limit,this.total);
  }


  next(){
    if(this.limit < this.total){
      this.hal++
      this.skip = this.hal * this.limitBayangan - this.limitBayangan
      this.limit = this.hal * this.limitBayangan
      // this.loadSoalSendiri()
      this.loadSiswa(this.nama_kelas)
    }
    console.log(this.hal,this.skip,this.limit,this.total);

  }
  prev(){
    if(this.hal > 1){
      this.hal--
      this.skip = this.hal * this.limitBayangan - this.limitBayangan
      this.limit = this.hal * this.limitBayangan
      // this.loadSoalSendiri()
      this.loadSiswa(this.nama_kelas)
    }else{
      this.hal = 1
      this.skip = 0
    }
    console.log(this.hal,this.skip,this.limit,this.total);
  }


}
