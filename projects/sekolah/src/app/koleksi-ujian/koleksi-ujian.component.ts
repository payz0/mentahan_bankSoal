import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';


@Component({
  selector: 'app-koleksi-ujian',
  templateUrl: './koleksi-ujian.component.html',
  styleUrls: ['./koleksi-ujian.component.css'],

})
export class KoleksiUjianComponent implements OnInit {


  files!: File;
  dataMapel:any
  dataKelas:any
  dataKelases:any
  dataKoleksi:any
  dataUjian:any
  file_loc:any
  ujian:any = {}
  ujianDetail:any = {}
  fileName:string = ''
  infoBox:boolean = false
  clases:any = []
  changeStatus:boolean = false
  tahun:any = [new Date().getFullYear() - 2, new Date().getFullYear() - 1,new Date().getFullYear()]
  idx:any
  showDetail:boolean = false
  statusSebagai:any = sessionStorage.getItem('sebagai')
  constructor(private _data:DataService, private router:Router) { }

  ngOnInit(): void {
    this.loadUjian()
    this._data.socket.on('loadDatas',(a:any)=>{
      let i = this.dataUjian.findIndex((b:any)=>{return b._id == a._id})
      if(i != -1){
        this.dataUjian[i] = a
      }
      // this.loadUjian()
    })

    this.ujian.semester =  new Date().getMonth() < 7 ? 'Genap' : 'Ganjil'
  }

  loadUjian(){
    this._data.loading = true
    this._data.getData('tabelUjian&id_guru&'+sessionStorage.getItem('id_guru')).subscribe(a=>{
      this.dataUjian = a
      this._data.loading = false
    })
  }


  process(event:any) {
    this.files = <File>event.target.files[0];
    const reader = new FileReader()
    reader.onload = e => this.file_loc = reader.result;
    reader.readAsDataURL(this.files)
  }

  simpan(){
    this._data.loading = true
    let cek = [
      "nama_ujian",
     "mapel",
     "jenis",
     "semester",
     "durasi",
     "tgl_ujian",
     "jam_ujian",
     "tahun_ajaran",
     "kelas",
     "id_koleksi_soal",
     "nama_koleksi",
     "status",
     "tgl"]
     this.ujian.id_guru = sessionStorage.getItem('id_guru')
     this.ujian.nama_guru = sessionStorage.getItem('nama_guru')
     if(this.ujian.koleksiSoal){
      this.ujian.id_koleksi_soal = this.ujian.koleksiSoal.split('|')[0]
      this.ujian.nama_koleksi = this.ujian.koleksiSoal.split('|')[1]
     }

     if(!this.ujian.status){
        this.ujian.status = 'Off'
     }
    this.ujian.tgl = new Date()
    delete this.ujian.koleksiSoal
    // console.log(this.ujian);
    this._data.cekFormatExcel(Object.keys(this.ujian),cek).then((a)=>{
      if(!a){
        if(this.ujian.durasi > 0){
          this._data.postData(this.ujian,'tabelUjian').subscribe(z=>{
            this._data.loading = false
            this.infoBox = false
            console.log(z.status);
            let ins = this.dataUjian.findIndex((b:any)=>{return b._id == z._id})
            console.log(ins);
            if(ins == -1){
              this.dataUjian.push(z)
              this._data.info('Ujian sukses di buat')
            }else{
              this.dataUjian[ins] = z
              this._data.info('Ujian '+z.status)
              if(z.jenis != 'Harian'){
                this._data.socket.emit('mapel',z)
              }else{
                this._data.socket.emit('ulHarian')
              }
            }
            console.log(z);

            // realtime socket

            // if(z.jenis == 'PTS' || z.status == 'PAS'){
            // let kirimData = {_id:z._id,mapel:z.mapel,token:z.token,tgl_ujian:z.tgl_ujian,jam_ujian:z.jam_ujian,kelas:z.kelas,status:z.status}

            // }
            this.ujian = {}

          })
        }else{
          this._data.loading =false
          this._data.info('Durasi tidak boleh nol')
        }
      }else{
        this._data.loading = false
        this._data.info(a+" belum di isi")
      }
    })


  }

  loadMapelClass(){
    this._data.loading = true
    this._data.getData('tabelKelas').subscribe(a=>{
      this.dataKelas = a
      this.dataKelases = a
      this._data.getData('tabelNgajar&id_guru&'+sessionStorage.getItem('id_guru')).subscribe((b:any)=>{
        let cek = []
        // this.dataMapel = b
        for(let i = 0; b.length > i;i++){
          if(cek.findIndex((v:any)=>{return v.mapel == b[i].mapel}) == -1){
            cek.push(b[i])
          }
          // this.dataKelas.push({'kelas':b[i].kelas})
          if(b.length == i+1){
            this.dataMapel = cek
            this._data.loading = false
          }
        }
        this._data.getData('tabelKoleksiSoal&id_guru&'+sessionStorage.getItem('id_guru')).subscribe(c=>{
          this.dataKoleksi = c
        })
      })
    })
  }

  pilihKelas(kelas:string){
    let i = this.clases.indexOf(kelas)
    if(i == -1){
      this.clases.push(kelas)
    }else{
      this.clases.splice(i,1)
    }
    this.ujian.kelas = this.clases.join(",")

  }

  pilihSemua(tingkat:any){
    this.clases = []
    let data = this.dataKelases.filter((a:any)=>{return a.kelas.split('')[0] == tingkat})
    data.forEach((el:any,i:number) => {
      let n = this.clases.indexOf(el.kelas)
      if(n == -1){
        this.clases.push(el.kelas)
      }else{
        this.clases.splice(n,1)
      }
      if(data.length == i+1){
        this.ujian.kelas = this.clases.join(",")
      }
    });
    this.dataKelas = data
    // this.ujian.kelas = data.join(",")
    // console.log(data);


  }

  pilihStatus(i:number,status:string){
    this.dataUjian[i].status =  status
    if(status == 'Mulai'){
      this.dataUjian[i].token =  Math.random().toString(36).slice(8).toLocaleUpperCase()
    }else{
      this.dataUjian[i].token = null
    }
    this.changeStatus =  !this.changeStatus
    // this.rubahStatus(status,i)
    this.ujian =  this.dataUjian[i]
    setTimeout(() => {
      this.simpan()
    }, 0);

    // console.log(this.ujian);

  }

  getIndex(i:any){
    console.log(i);
    this.idx = i
  }

  preview(id_koleksi:string){
    this._data._id = id_koleksi
    this.router.navigate(['/dashboard/ujian'])
  }

  rubahStatus(status:string){

    let ind = this.dataUjian.findIndex((a:any)=>{return a._id == this.ujianDetail._id})
    if(status == 'Mulai'){
      this.dataUjian[ind].token =  Math.random().toString(36).slice(8).toLocaleUpperCase()
    }else{
      this.dataUjian[ind].token = null
    }
    this.ujian = this.dataUjian[ind]
    this.ujian.status = status

    console.log(this.ujian);
    this.simpan()
  }

  hapus(){
    let i = this.dataUjian.findIndex((a:any)=>{return a._id == this.ujianDetail._id})
    this._data.deleteData('tabelUjian',this.ujianDetail._id).subscribe(a=>{
      this.dataUjian.splice(i,1)
      this._data.info('Ujian telah di hapus')
    })
    this.infoBox = false;
    this.showDetail = false;
  }

  tglUjian(e:any){
    // console.log(e.target.value);
    this.ujian.tgl_ujian = e.target.value
  }
}
