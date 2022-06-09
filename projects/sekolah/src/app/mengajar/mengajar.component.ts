import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-mengajar',
  templateUrl: './mengajar.component.html',
  styleUrls: ['./mengajar.component.css']
})
export class MengajarComponent implements OnInit {

  dataGuru:any
  dataKelas:any
  dataMapel:any
  dataKelasPer:any
  showMapel:boolean =false
  showKelas:boolean = false
  id_guru:string = ''
  id_mapel:string = ''
  nama_mapel:string = ''
  arrayMapel:any = []
  arrKelas:any = []
  deletArr:any = []
  indexNgajar:any
  constructor(private _data:DataService) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData(){
    this._data.loading = true
    this._data.getData('tabelGuru').subscribe(a=>{
      this.dataGuru = this._data.sortAsc(a,'nama_guru')
      this._data.getData('tabelMapel').subscribe(b=>{
        this.dataMapel = this._data.sortAsc(b,'tingkat')
        this._data.getData('tabelKelas').subscribe(c=>{
          this.dataKelas = this._data.sortAsc(c,'kelas')
          this._data.getData('tabelNgajar').subscribe(d=>{
            this.arrayMapel = d
            this._data.loading = false
          })
        })
      })
    })
  }

  pilihGuru(id:string){
    let i = this.arrayMapel.findIndex((a:any)=>{return a.id_guru === id})
    this.id_guru = id
    this.id_mapel = ''
    if(i != -1){
      this.arrKelas = this.arrayMapel[i].kelas ? this.arrayMapel[i].kelas.split(',') :[]
    }else{
      this.arrKelas = []
    }
  }

  tambahMapel(id:String,mapel:string,tingkat:number){
    if(this.id_guru){
      let i = this.arrayMapel.findIndex((a:any)=>{return a.id_mapel === id && a.id_guru === this.id_guru})
      console.log(i);

      if(i == -1){
        this.arrayMapel.push({'id_guru':this.id_guru,'id_mapel':id,'mapel':mapel,'tingkat':tingkat})
      }else{
        if(this.arrayMapel[i]._id){
          this.deletArr.push(this.arrayMapel[i]._id)
        }
        this.arrayMapel.splice(i,1)
      }

    }else{
     this._data.info("Pilih guru dulu")

    }

  }

  pilihMapel(index:any,id:string){
    let i = this.dataMapel.findIndex((a:any)=>{return a._id === id})
    let tingkat = this.arrayMapel[index].tingkat != undefined ? this.arrayMapel[index].tingkat : this.dataMapel[i].tingkat
    this.indexNgajar = index
    this.nama_mapel = this.arrayMapel[index].mapel
    this.dataKelasPer = this.dataKelas.filter((a:any)=>{return a.kelas.split('')[0] ==  tingkat})
    this.arrKelas = this.arrayMapel[index].kelas ? this.arrayMapel[index].kelas.split(',') :[]
    this.id_mapel = id
    console.log(this.dataMapel[i].tingkat);
    // console.log(this.deletArr);
  }

  tambahRuangan(kelas:string){
    if(this.id_mapel){
      if(this.arrKelas.indexOf(kelas) == -1){
        this.arrKelas.push(kelas)
      }else{
        this.arrKelas.splice(this.arrKelas.indexOf(kelas),1)
      }
        let i = this.arrayMapel.findIndex((a:any)=>{return a.id_guru === this.id_guru && a.id_mapel === this.id_mapel})
        if(i != -1){
          this.arrayMapel[i].kelas = this.arrKelas.join(',')
        }

    }else{
      this._data.info("Pilih Mapel dulu")
    }
  }

 simpan(){
    this.arrayMapel.forEach((el:any) => {
      delete el.tingkat
      this._data.postData(el,'tabelNgajar').subscribe(a=>{
        this._data.info("Data tersimpan")
      })
    });

    this.deletArr.forEach((el:any) => {
      this._data.deleteData('tabelNgajar',el).subscribe(b=>{
        console.log('deleted success');

      })
    });
  }

}
