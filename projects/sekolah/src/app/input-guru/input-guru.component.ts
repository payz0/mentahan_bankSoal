import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-input-guru',
  templateUrl: './input-guru.component.html',
  styleUrls: ['./input-guru.component.css']
})
export class InputGuruComponent implements OnInit {
  guru:any = {}
  dataGuru:any
  dataImport:any = []
  showBox:boolean = false
  dataKelas:any
  constructor(private _data:DataService) { }

  ngOnInit(): void {
    this.laodGuru()
    this.guru.sebagai = 'guru'
  }

  loadKelas(){
    this._data.loading = true
   this._data.getData('tabelKelas').subscribe(a=>{
      this.dataKelas = a
      this._data.loading = false
   })
  //  console.log('load kelas');

  }

  simpan(){
    this.guru.password = '123456'
    if(this.guru.sebagai == 'guru'){
      this.guru.kelas = null
    }
    if(this.guru.nama_guru && this.guru.nip){
      this._data.postData(this.guru,'tabelGuru').subscribe((a:any)=>{

        if(this.guru._id){
          let i = this.dataGuru.findIndex((c:any)=>{return c._id == this.guru._id})
          this.dataGuru[i] = a
          this._data.info('Data Guru telah dirubah')
        }else{
          this.dataGuru.push(a)
          this._data.info('Data Guru telah ditambahkan')
        }
        this.guru = {}
      })
    }else{
      this._data.info("Data harus di isi komplit")
    }
  }

  laodGuru(){
    this._data.loading = true
    this._data.getData('tabelGuru').subscribe((a:any)=>{
      this.dataGuru = a
      console.log(a.length);

      this._data.loading = false
    })
  }

  importExcel(e:any){
    let obj = ["nama_guru","nip","password","sebagai","kelas"]

    // let data:any = []
    this._data.importExcel(e).then((a:any)=>{
      // console.log(Object.keys(a[0]));
      console.log(a.length);
      this.dataImport = a
      this._data.cekFormatExcel(Object.keys(a[0]),obj).then(w=>{
        if(!w){
          this.showBox = true
        }

      })

    })
  }

  downloadExcel(){
    this._data.exportExcel('excel','format data guru')
  }

  hapus(data:any,i:number){
    this._data.deleteData('tabelGuru',data._id).subscribe(a=>{
      this.dataGuru.splice(i,1)
      this._data.info('Guru telah di hapus')
    })
  }

  simpanAll(){
    this.dataImport.forEach((el:any,i:any) => {
      this._data.postData(el,'tabelGuru').subscribe(a=>{
        this.dataGuru.push(a)
      })
      console.log(el.kelas);

      if(this.dataImport.length == i+1){
        this._data.info('Data telah di simpan')
        this.showBox = false
        this.dataImport = []
      }
    });
  }

}
