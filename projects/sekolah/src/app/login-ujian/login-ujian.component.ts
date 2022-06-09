import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login-ujian',
  templateUrl: './login-ujian.component.html',
  styleUrls: ['./login-ujian.component.css']
})
export class LoginUjianComponent implements OnInit {

  dataLogin:any = {}
  peserta:any = {}
  aksesLogin:boolean = false
  ujianMulai:boolean = false
  dataKelas:any
  dataUjian:any
  token:any
  versi:string = ""
  constructor(private _data:DataService, private router:Router) {
    this.versi = _data.versiApp
   }

  ngOnInit(): void {
    // console.log(sessionStorage.getItem('kelas')?.split('')[0]);



    if(localStorage.getItem('id_siswa')){
      this.aksesLogin = true
      this._data.getData('tabelSiswa&_id&'+localStorage.getItem('id_siswa')).subscribe(async(a:any)=>{
        this.peserta = await a[0]
        console.log(a[0]);

        if(a[0].go_ujian == "Belum login"){
          console.log('kebaca belum login');

          localStorage.clear();
          sessionStorage.clear()
          location.reload()
          this.router.navigate(['/ujian'])
        }else{
          console.log('sedang ujian');

          setTimeout(()=>{
            this.cekUjian()
          },0)
        }

      })

    }else{
      sessionStorage.clear()
      localStorage.clear()
    }
    this._data.socket.on('loadDatas',()=>{
      this.cekUjian()
    })

    this._data.socket.on('ulHarians',()=>{
      this.cekUjian()
    })
    this._data.socket.on('resetPesertas',(kelas:number)=>{
      if(sessionStorage.getItem('kelas')?.split('')[0] == kelas.toString()){
        sessionStorage.clear()
        location.reload();
        this.router.navigate(['/ujian'])
        // console.log(kelas);
      }
    })
    this._data.socket.on('resetSiswas',(data:string)=>{
      if(data == localStorage.getItem('id_siswa')){
        sessionStorage.clear()
        localStorage.removeItem('id_siswa')
        location.reload();
        this.router.navigate(['/ujian'])
      }
    })
  }

  login(){
    // this._data.loading = true
    sessionStorage.clear()
    localStorage.clear()
    this._data.getData('tabelSiswa&nisn&'+this.dataLogin.nisn+'&nis&'+this.dataLogin.nis).subscribe((a:any)=>{
      console.log(a);

      if(!a.length){
        this._data.info('Salah nisn atau nis')
      }else{
        if(a[0].go_ujian == 'Belum login' || a[0].go_ujian == null){
          this.aksesLogin = true
          this.peserta = a[0]
          localStorage.setItem('id_siswa',a[0]._id)
          sessionStorage.setItem('kelas',a[0].kelas)
          a[0].go_ujian = 'Standby'
          this._data.postData(a[0],'tabelSiswa').subscribe(s=>{
            this._data.socket.emit('aksiSiswa',s)
          })
          this.cekUjian()
        }else{
          this._data.info('Maaf anda sudah login')
          this.dataLogin = {}
          this.router.navigate(['/ujian'])
        }
      }

    })
  }

  mulai(){
    console.log(this.dataUjian.token, this.token);

    if(this.token == this.dataUjian.token){
      if( localStorage.getItem('idCollect')){
        this.ujianMulai = true
        this._data._id =  localStorage.getItem('idCollect')
        this.peserta.go_ujian = 'Sedang ujian'
        this._data.postData(this.peserta,'tabelSiswa').subscribe(s=>{
          this._data.socket.emit('aksiSiswa',s)
        })
      }
    }else{
      this._data.info('Maaf token salah')
    }
  }

  cekUjian(){
    this._data.loading = true
    let tgl = new Date().getFullYear()+'-'+Number(new Date().getMonth()+1).toString().padStart(2,'0')+'-'+new Date().getDate().toString().padStart(2,'0')
    this._data.getData('tabelUjian&tgl_ujian&'+tgl+'&status&Mulai').subscribe(async(a:any)=>{
      console.log(a.findIndex((x:any)=>{return x.mapel.split(' ')[1] == 'Agama'}));

      this._data.loading = false
      if(this.peserta.go_ujian == 'Belum login'){
        sessionStorage.clear()
        this.router.navigate(['/ujian'])
      }

      if(a.length){
        // console.log(this.peserta);
        if(a.findIndex((x:any)=>{return x.mapel.split(' ')[1] == 'Agama'}) == -1){
          this.dataUjian = await a.filter((c:any)=>{return c.kelas.split(',')[0].split('')[0] == this.peserta.kelas.split('')[0]})[0]
        }else{
          this.dataUjian = await a.filter((c:any)=>{return c.kelas.split(',')[0].split('')[0] == this.peserta.kelas.split('')[0] && c.mapel.split(' ')[2] == this.peserta.agama})[0]
        }
        // console.log(this.dataUjian);


        if(this.dataUjian){
          this.dataKelas = this.dataUjian.kelas.split(',')
          let b = this.dataKelas.indexOf(this.peserta.kelas)
          console.log(this.dataUjian);

          localStorage.setItem('idCollect',this.dataUjian.id_koleksi_soal)
          sessionStorage.setItem('mapel',this.dataUjian.mapel)
          sessionStorage.setItem('jenis',this.dataUjian.jenis)
          sessionStorage.setItem('nama_ujian',this.dataUjian.nama_ujian)
          sessionStorage.setItem('tahun_ajaran',this.dataUjian.tahun_ajaran)
          sessionStorage.setItem('semester',this.dataUjian.semester)
          sessionStorage.setItem('kelas',this.peserta.kelas)
          if(!localStorage.getItem('menit')){
            localStorage.setItem('menit',this.dataUjian.durasi)
          }
          if(this.peserta.go_ujian == 'Sedang ujian'){
            this._data._id = localStorage.getItem('idCollect')
            this.ujianMulai = true
          }
          this.peserta.mapel = await this.dataUjian.mapel
          this.peserta.durasi = await this.dataUjian.durasi+" menit"
          if(b != -1){
            this.peserta.jenis = await this.dataUjian.jenis
          }else{
            this.peserta.jenis = 'Kelas '+this.peserta.kelas+' tidak ada ujian hari ini'
          }
        }else{
          this.peserta.durasi = 0
          this.peserta.mapel = "Tunggu .."
          this.peserta.jenis = "Tunggu .."
        }
      }else{
        this.peserta.durasi = 0
        this.peserta.mapel = "Tunggu .."
        this.peserta.jenis = "Tunggu .."
      }
    })
  }

}
