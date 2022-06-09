import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import {Subject, Observable} from 'rxjs'

@Component({
  selector: 'app-ujian',
  templateUrl: './ujian.component.html',
  styleUrls: ['./ujian.component.css']
})
export class UjianComponent implements OnInit {
  opsi:string = "null"
  info:boolean = false
  sizeText:String = "text-base"
  dataSoal:any = []
  soal:any = {}
  ind:number = 0
  jawaban:any = []
  koreksi:any = []
  // kirimJawab:any = {}
  nilai:number = 0
  blokirOpsi:boolean = false
  menit:any = 0
  detik:any = 0
  curang:number = 0
  sebagai: boolean = localStorage.getItem('id_siswa') ? true : false
  kameraMati:boolean = false
  daftarSoal:any
  persentaseLoading:number = 0
  showPersen:boolean = true
  versi:string = ""
  stopTImer:any
  constructor(private _data:DataService,private router:Router) { }

  ngAfterViewInit() {
    if(this._data._id){
      this.loadSoal(this._data._id)
    }
    this.versi = this._data.versiApp
  }


  @HostListener('document:visibilitychange') onchange(){
    this.curang++
    sessionStorage.setItem('curang',this.curang.toString())
    let data = {'_id':localStorage.getItem('id_siswa'),'curang':this.curang}
    this._data.socket.emit('detekCurang',data)
  }

  ngOnInit(): void {
    // if(this._data.jawaban){
    //   localStorage.setItem('ur',this._data.jawaban)
    // }
    if(localStorage.getItem('menit')){
      this.menit = localStorage.getItem('menit')
      this.detik = localStorage.getItem('detik')
      if(localStorage.getItem('id_siswa')){
        this.timer(this.menit,1000)
      }
    }

    if(sessionStorage.getItem('curang')){
      this.curang = Number(sessionStorage.getItem('curang'))
    }
    this._data.socket.on('resetPesertas',(kelas:number)=>{
      if(sessionStorage.getItem('kelas')?.split('')[0] == kelas.toString()){
        sessionStorage.clear()
        localStorage.clear()
        this.router.navigate(['/ujian'])
      // console.log(kelas);
      }

    })

    this._data.socket.on('resetSiswas',(id:string)=>{
      if(localStorage.getItem('id_siswa') == id){
        sessionStorage.clear()
        localStorage.clear()
        setTimeout(()=>{
          this.router.navigate(['/ujian'])
        },1000)
      }
    })

    this._data.socket.on('cekrek',(data:any)=>{
      console.log(data);

      if(localStorage.getItem('id_siswa') == data.id_siswa){
        this.triggerSnapshot()

        setTimeout(()=>{
          if(!this.kameraMati){
             this._data.socket.emit('kirim foto',{'image':this.webcamImage,'nama_siswa':data.nama_siswa,'id_guru':data.id_guru})
          }else{
            this._data.socket.emit('kirim foto',{'error':'mati','image':this.webcamImage,'nama_siswa':data.nama_siswa,'id_guru':data.id_guru})
          }
        },100)
      }
    })
  }




  pilihOpsi(obj:string){
    // console.log(this.dataSoal);

    let h = -1
    if(!this.blokirOpsi){
      this.dataSoal[this.ind].pilihan = obj.split('&')[1]
      let i = this.jawaban.findIndex((a:any)=>{return a.split('&')[0] == obj.split('&')[0]})
      if(i == -1){
            this.jawaban.push(obj)
      }else{
            this.jawaban[i] = obj
      }
      // let i = this.koreksi.findIndex((a:any)=>{return a.id_soal == this.dataSoal[this.ind]._id})

      //   this.jawaban.forEach((el:any,n:number)=>{
      //     if(el.split('&')[0] == this.dataSoal[this.ind]._id){
      //       h = n
      //     }
      //   })

      // if(i == -1){
      //   if(this.dataSoal[this.ind].jawaban == obj){
      //     this.koreksi.push({'id_soal':this.dataSoal[this.ind]._id,'nilai':1})
      //   }else{
      //     this.koreksi.push({'id_soal':this.dataSoal[this.ind]._id,'nilai':0})
      //   }
      //   if(h == -1){
      //     this.jawaban.push(this.dataSoal[this.ind]._id+"&"+obj)
      //   }else{
      //     this.jawaban[h] = this.dataSoal[this.ind]._id+"&"+obj
      //   }

      // }else{
      //   if(this.dataSoal[this.ind].jawaban == obj){
      //     this.koreksi[i].nilai = 1
      //   }else{
      //     this.koreksi[i].nilai = 0
      //   }
      //   this.jawaban[i] = this.dataSoal[this.ind]._id+"&"+obj
      // }

      console.log(this.jawaban);
      localStorage.setItem('ur',this.jawaban)
    }
  }

  ukuranText(obj:string){
    this.sizeText = obj
  }

  loadSoal(id_koleksi:string){
    this._data.loading = true
    let kolek:any = localStorage.getItem('ur')?.split(',')
    this.dataSoal = []
    this._data.getData('tabelKoleksiSoal&_id&'+id_koleksi).subscribe((a:any)=>{
      // console.log(a[0].daftar_soal.split(','));

      this.daftarSoal = a[0].daftar_soal.split(',')
      let tot = 0
      let jum = a[0].daftar_soal.split(',').length
      a[0].daftar_soal.split(',').forEach((el:string,i:any) => {

        this._data.getData('tabelSoal&_id&'+el.split('&')[0]).subscribe((z:any)=>{
          // console.log(z[0]);
          tot++
          this.persentaseLoading =  Math.ceil((tot/jum)*100)
          if(this.persentaseLoading == 100){
            setTimeout(()=>{
              this.showPersen = false
              // console.log(a[0].daftar_soal.split(',').length);
              sessionStorage.setItem('jumlah_soal',a[0].daftar_soal.split(',').length)
            },2000)
          }

          if(localStorage.getItem('ur')){
              this.jawaban = localStorage.getItem('ur')?.split(',')
            for(let n = 0; kolek.length > n ; n++){

              let k = this.dataSoal.findIndex((x:any)=>{return x._id == z[0]._id})
                if(k == -1){

                  if(kolek[n].split("&")[0] == z[0]._id){
                    this.dataSoal.push({...z[0],...{'pilihan':kolek[n].split("&")[1]}})
                  }else{
                    this.dataSoal.push(z[0])
                    console.log('ditambah ke sini');
                  }
                }else{
                  if(kolek[n].split("&")[0] == this.dataSoal[k]._id){
                    this.dataSoal[k].pilihan = kolek[n].split("&")[1]
                  }
                }

            }



          }else{
            this.dataSoal.push(z[0])
          }

          if(a[0].daftar_soal.split(',').length == i+1){
            // console.log(this.dataSoal);
            this.soal = this.dataSoal[0]
            // console.log(this.jawaban);
            this._data.loading = false
          }
        })

      });
    })
  }

kirimJawaban(){
  clearInterval(this.stopTImer)
  this._data.loading = true
  if(localStorage.getItem('id_siswa') && sessionStorage.getItem('jumlah_soal')){
    this.jawabanBetul().then((l:any)=>{
      console.log(l);
      console.log(l.jawab_soal.split(',').length);

    // console.log(m);
    // console.log(this.jawaban);
    // console.log(this.koreksi);

      this._data.postData(l,'tabelJawaban').subscribe(z=>{
        this._data.updateData('tabelSiswa',{'_id':localStorage.getItem('id_siswa'),'go_ujian':'Selesai'}).subscribe(g=>{
          this._data.loading = false
          this._data.socket.emit('selesaiUjian',g)
          // this._data.socket.emit('aksiSiswas',g)
          // console.log(z);

          this._data.info('Jawaban anda sudah terkirim')
          sessionStorage.clear()
          localStorage.clear()
          // setTimeout(()=>{
          //   location.reload()
            this.router.navigate(['/'])
          // },1000)

        })


      })
    })
  }else{
    this._data.info('Soal belum 100%')
    location.reload()
  }


}

  jawabanBetul(){
    return new Promise((resolve)=>{
      let betul = 0
      let total = 0
      let jum_soal = Number(sessionStorage.getItem('jumlah_soal'))
      // let nilai = 0
      this.jawaban.forEach((el:any)=>{
        total++
        let i = this.dataSoal.findIndex((a:any)=>{return a._id == el.split('&')[0] && a.jawaban == el.split('&')[1]})
        if( i != -1){
          betul++
        }
        if(this.jawaban.length == total){
          resolve({
            'jawaban_betul': betul ,
            'nilai': Number(100 / jum_soal)*betul,
            'id_ujian':this._data._id,
            'jawab_soal':this.jawaban.join(','),
            'mapel': sessionStorage.getItem('mapel'),
            'kelas':sessionStorage.getItem('kelas'),
            'id_siswa':localStorage.getItem('id_siswa'),
            'tgl_ujian': new Date().getDate().toString().padStart(2,'0')+'/'+Number(new Date().getMonth()+1).toString().padStart(2,'0')+'/'+new Date().getFullYear(),
            'jenis_ujian': sessionStorage.getItem('jenis'),
            'nama_ujian': sessionStorage.getItem('nama_ujian'),
            'tahun_ajaran': sessionStorage.getItem('tahun_ajaran'),
            'semester': sessionStorage.getItem('semester'),
            'curang' : sessionStorage.getItem('curang'),
            'jumlah_soal': jum_soal
          })

        //  resolve(m)

        }
      })
    })

  }
  pilihNoSoal(data:any,i:number){
    this.soal = data
    this.ind = i
    // console.log(this.soal);

  }

  sebelumnya(){
    if(this.ind > 0){
      this.ind--
    }
    this.soal =  this.dataSoal[this.ind]
    // console.log(this.ind);

  }

  selanjutnya(){
    // if(this.dataSoal.length > this.ind+1){
    if(this.dataSoal[this.ind]){
      this.ind++
    }
    this.soal =  this.dataSoal[this.ind]
    // console.log(this.ind);
  }

  timer(durasi:number, speed:number) {
    this.menit = durasi
    this.stopTImer = setInterval(() => {
      this.detik--
      if (this.detik < 0) {
        this.detik = 60;
        this.menit--
      }

      if (this.menit < 0) {
        this.detik = 0
        this.menit = 0
        clearInterval(this.stopTImer);
        this.kirimJawaban()
      }
        localStorage.setItem("menit", this.menit);
        localStorage.setItem("detik", this.detik);
    }, speed);
  }


  // kamera untuk ujian
  webcamImage:any
  trigger: Subject<void> = new Subject<void>()
  facingMode: string = 'user';  //Set front camera
  allowCameraSwitch = false;

  triggerSnapshot(): void {
    this.trigger.next();
   }

  public handleInitError(error: WebcamInitError): void {
    this.kameraMati = false
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
      alert('Kamera harus di izinkan nyala')
      this.kameraMati = true
    }
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
   }

  handleImage(webcamImage: WebcamImage): void {
    console.log(webcamImage.imageAsDataUrl);
    this.webcamImage = webcamImage.imageAsDataUrl;
   }

   public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints = {};
    if (this.facingMode && this.facingMode !== '') {
        result.facingMode = { ideal: this.facingMode };
    }
    return result;
  }

  reload(){
    location.reload();
  }
}
