import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-input-siswa',
  templateUrl: './input-siswa.component.html',
  styleUrls: ['./input-siswa.component.css']
})
export class InputSiswaComponent implements OnInit {
  total:number = 0
  sisa:number = 0
  limit:number = 0
  hal:number = 1
  skip:number = 0
  siswa:any = {}
  allData:any
  cari:string = ''
  sorter:boolean = true
  dataImport:any
  showBox:boolean = false
  constructor(private _data:DataService) { }

  ngOnInit(): void {
    this.limit = 10
    this.loadData()
    // this._data.getData('tabelSiswa').subscribe(a=>{
    //   console.log(a);

    // })
  }

  simpan(){
    if(this.siswa.status == "nonaktif"){
      this.siswa.kelas = null
    }
    if(this.siswa.nama_siswa != undefined){
      this._data.postData(this.siswa,'tabelSiswa').subscribe(a=>{
        let i = this.allData.findIndex((b:any)=>{return b._id == a._id})
        if(i == -1){
          this.allData.push(a)
        }else{
          this.allData[i] = a
        }
        this._data.info(this.siswa.nama_siswa + " ditambahkan")
        this.siswa = {}
      })

    }else{
      this._data.info("Isi data dulu")
      this.siswa = {}
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


  loadData(){
    this._data.loading = true
    this._data.selectData('tabelSiswa',this.limit,this.skip).subscribe((a:any)=>{
      this.allData = this._data.sortAsc(a,'status')
      this._data.loading = false
      console.log(a);

    })
  }

  deleted(id:string){
    let i = this.allData.findIndex((a:any)=>{return a._id == id})
    this._data.deleteData('tabelSiswa',id).subscribe((a:any)=>{
      this._data.info(a.nama_siswa + "di hapus")
      this.allData.splice(i,1)
    })
  }

  importExcel(e:any){
    let obj = ["nama_siswa","nis","nisn","kelas","sex","agama","status"]

    // let data:any = []
    this._data.importExcel(e).then((a:any)=>{
      // console.log(Object.keys(a[0]));
      // console.log(a);
      this.dataImport = a
      this._data.cekFormatExcel(Object.keys(a[0]),obj).then(w=>{
        if(!w){
          this.showBox = true
        }else{
          this._data.info('format tidak sesuai')
        }

      })

    })

  }

  downloadExcel(){
    this._data.exportExcel('excel','format data siswa')
  }

  simpanAll(){
    this.dataImport.forEach((el:any,i:any) => {
      // this._data.getData('tabelSiswa&nisn&'+el.nisn+'&nis&'+el.nis).subscribe((a:any)=>{

      //   if(a.length){
      //     a[0]['agama'] = el.agama
      //     a[0]['sex'] = el.sex
      //      this._data.postData(a[0],'tabelSiswa').subscribe(b=>{
      //         this.allData.push(b)
      //       })
      //   }

      // })
      this._data.postData(el,'tabelSiswa').subscribe(a=>{
        this.allData.push(a)
      })
      if(this.dataImport.length == i+1){
        this._data.info('Data telah di simpan')
        this.showBox = false
        this.dataImport = []
      }
    });
  }

  loadSoalSendiri(){
    this._data.loading = true
    this._data.selectData("tabelSiswa",this.limit,this.skip).subscribe((a:any)=>{
      this.allData = a
      // this.doubles = a
      this._data.getTotal("tabelSiswa").subscribe(m=>{
        this._data.loading = false
        this.total = Number(m)
        this.sisa = Math.ceil(Number(m) / this.limit)
        // console.log(m);

      })
    })
  }


  next(){
    let jum = Math.ceil(this.total / this.limit)
    if(this.hal != jum){
      this.hal++
      this.skip = this.hal * this.limit - this.limit

      this.loadSoalSendiri()
    }
    // console.log(jum);

  }
  prev(){
    if(this.hal > 1){
      this.hal--
      this.skip = this.hal * this.limit - this.limit
      this.loadSoalSendiri()
    }else{
      this.hal = 1
      this.skip = 0
    }
  }
  cariSemua(){
    this._data.loading = true
    this._data.getData('tabelSiswa&status&aktif').subscribe(a=>{
      this.allData = a
      this._data.loading = false
    })
  }
}
