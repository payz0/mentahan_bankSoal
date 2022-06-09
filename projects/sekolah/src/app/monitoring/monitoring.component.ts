import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {
  dataKelas:any
  dataSiswa:any
  statusSebagai:any = sessionStorage.getItem('sebagai')
  tabs:string = 'mapel'
  token:any = Math.random().toString(36).slice(8).toLocaleUpperCase()
  dataUjian:any
  ujians:any
  kelas:string = '7'
  clases:string ='7A'
  start:boolean = false
  dataToken:any
  blogin:number = 0
  stby:number = 0
  inrun:number = 0
  selesai:number = 0
  statusUjian:string = 'null'
  dataAgama:any
  konfirmReset:boolean = false
  reSis:any = {}
  imgCap:any = null
  namaCap:string = ''
  constructor(private _data:DataService) { }

  ngOnInit(): void {

    // this._data.getData('tabelSiswa&status&aktif').subscribe((a:any)=>{
    //   console.log(a.filter((b:any)=>{return b.kelas.split('')[0] == 7}));

    // })
    this.loadToken()
    this.loadTotalan()
    if(this.statusSebagai == 'admin'){
      this.loadUjian()
    }else{
      this.loadSiswaFull()
    }
    this.loadKelas()



    if(sessionStorage.getItem('sebagai') == 'admin'){
        this._data.socket.on('mapels',async(data:any)=>{
          // this.loadUjian()
          if(this.ujians.length){
            let i = await this.ujians.findIndex((b:any)=>{return b._id == data._id})
            if(i != -1){
                if(data.status == "Off"){
                  this.ujians.splice(i,1)
                }else{
                  this.ujians[i] = data
                }
            }else{
              await this.ujians.push(data)
            }

            setTimeout(()=>{
              this.lihatKelas()
            },100)
          }

    })


      this._data.socket.on('loadDatas',async(a:any)=>{
        // this.lihatKelas()
        // console.log(a);

        if(this.dataUjian.length){
          let i = await this.ujians.findIndex((b:any)=>{return b._id == a._id})
          let t = await this.dataUjian.findIndex((b:any)=>{return b._id == a._id})

          if(i !=1 ){
            this.ujians[i] = await a
            setTimeout(()=>{
              this.lihatKelas()
              let m =  this.dataUjian.findIndex((b:any)=>{return b._id == a._id})
              this.dataUjian[m] =  a
            },100)
          }

          if(t != 1){
            this.dataUjian[t] = await a
          }
        }
      })
    }

    this._data.socket.on('aksiSiswas',(f:any)=>{
      this.loadTotalan()
      if(this.dataSiswa?.length){
        let i = this.dataSiswa.findIndex((a:any)=>{ return a._id == f._id})
        if(i != -1){
          this.dataSiswa[i] = f
        }
      }
    })

    this._data.socket.on('resetPesertas',()=>{
      this.loadTotalan()
      this.loadSiswa()
    })

    this._data.socket.on('resetSiswas',(id:string)=>{
      this.loadTotalan()
      if(this.dataSiswa?.length){
        let i = this.dataSiswa.findIndex((a:any)=>{return a._id == id})
        this.dataSiswa[i]['go_ujian'] = "Belum login"
      }
    })

    this._data.socket.on('laporSelesai',(data:any)=>{
      if(this.dataSiswa?.length){
        let i = this.dataSiswa.findIndex((h:any)=>{return h._id == data._id})
        this.dataSiswa[i] = data
      }
      // this.loadSiswa()
    })

    this._data.socket.on('detekCurangs', (id:any)=>{
      if(id.length && this.dataSiswa){
        id.forEach((a:any)=>{
          let i  = this.dataSiswa.findIndex((c:any)=>{return c._id == a._id})
          if(i != -1){
            this.dataSiswa[i]['curang'] = a.curang
          }
        })
      }
    })

    this._data.socket.on('sendToken',(data:any)=>{

      // console.log(data);

      data.forEach((al:any,i:number)=>{
        let m = this.dataToken.findIndex((a:any)=>{return a.kelas == al.kelas})
        // console.log(al,m);

        if(m != -1){
          if(al.token != null){
            this.dataToken[m] = al
          }else{
            this.dataToken[m].token = null
          }
        }else{
          if(al.token != null){
            this.dataToken.push(al)
          }
        }

        if(data.length == i+1){
          // console.log(this.dataToken);
          this.dataToken = this._data.sortAsc(this.dataToken,'kelas')
        }
      })
      // let i = this.dataToken.findIndex((a:any)=>{return a.kelas == data.kelas})
      // if(i != -1){
      //   this.dataToken[i] = data
      // }else{
      //   this.dataToken.push(data)
      // }
      // this.loadToken()
      // console.log(data);
      // this.dataToken = this._data.sortAsc(data,'kelas')
      // data
      // console.log(this.dataToken);

    })

    // this._data.socket.emit('mintaData')

    this._data.socket.on('terima foto',(data:any)=>{
      // console.log(data);

      if(sessionStorage.getItem('id_guru') ==  data.id_guru){
        if(data.error){
        this._data.info('tidak ada kamera')
        }
        this.imgCap = data.image
        this.namaCap = data.nama_siswa
      }
    })
  }


  lihatKelas(){
    this.dataUjian = this._data.sortAsc(this.ujians.filter((a:any)=>{return a.kelas.split(',')[0].split('')[0] == this.kelas}),'tgl_ujian')
    // console.log(this.dataUjian);
    this.dataAgama = this.dataUjian.filter((g:any)=>{return g.mapel.split(' ')[1] == 'Agama'})
  }

  statusSiswa(a:string){
    this.tabs = 'siswa'
    this.statusUjian = a
    this.loadSiswa()

  }

  loadSiswa(){
    // console.log(this.clases);

    this._data.loading = true
    if(this.statusUjian != 'null'){
    this._data.getData('tabelSiswa&kelas&'+this.clases+'&go_ujian&'+this.statusUjian).subscribe(a=>{
      this.dataSiswa = this._data.sortAsc(a,'nama_siswa')
      // console.log(a);
      this._data.loading = false
      this._data.socket.emit('mintaData')
    })
    }else{
      this.loadSiswaFull()
    }
  }

  loadSiswaFull(){
    this._data.loading = true
    this._data.getData('tabelSiswa&kelas&'+this.clases).subscribe(a=>{
      this.dataSiswa = this._data.sortAsc(a,'nama_siswa')
      // console.log(a);
      this._data.loading = false
      this._data.socket.emit('mintaData')
    })
  }

  loadKelas(){
    this._data.loading = true
    this._data.getData('tabelKelas').subscribe(a=>{
      this.dataKelas = this._data.sortAsc(a,'kelas')
      // a
      // console.log(a);
      this._data.loading = false
    })
  }

  loadUjian(){
    this._data.loading = true
    this.ujians = []
    this._data.getData('tabelUjian&status&Mulai').subscribe((z:any)=>{
      this.ujians = z.filter((h:any)=>{return h.jenis != 'Harian'})
      this._data.getData('tabelUjian&status&Standby').subscribe((c:any)=>{
        c.forEach((m:any)=>{
          if(m.jenis != 'Harian'){
            this.ujians.push(m)
          }

        })

        this.dataUjian = this._data.sortAsc(this.ujians.filter((a:any)=>{return a.kelas.split(',')[0].split('')[0] == this.kelas}),'tgl_ujian')
        this.dataAgama = this.dataUjian.filter((g:any)=>{return g.mapel.split(' ')[1] == 'Agama'})
        // console.log(this.dataAgama);

        this._data.loading = false
      })
    })
  }

  openTab(tab:string){
    this.tabs = tab
    if(tab == 'mapel'){

      this.loadUjian()
    }
  }

  startUjian(id:string,lock:boolean,mapel:string){
    let agama = mapel.split(' ')[1]
    let stat:string
    this.start = !lock
    if(this.start){
      stat = 'Mulai'
      this.token = Math.random().toString(36).slice(8).toLocaleUpperCase()
    }else{
      stat = 'Standby'
      this.token = null
    }

    if(agama != 'Agama'){
      this._data.postData({'_id':id,'status':stat,'token':this.token,'lock':this.start},'tabelUjian').subscribe(z=>{
        let i = this.dataUjian.findIndex((n:any)=>{return n._id == z._id})
        let n = this.ujians.findIndex((n:any)=>{return n._id == z._id})
        this.dataUjian[i] = z
        this.ujians[n] = z

        let dataToken = {'token':z.token,'kelas':z.kelas.split(',')[0].split('')[0]}
        this._data.socket.emit('kirimToken',dataToken)
        this._data.socket.emit('loadData',z)
      })
    }else{
      this.dataAgama.forEach((al:any,g:number)=>{
        this._data.postData({'_id':al._id,'status':stat,'token':this.token,'lock':this.start},'tabelUjian').subscribe(z=>{
          let i = this.dataUjian.findIndex((n:any)=>{return n._id == z._id})
          let n = this.ujians.findIndex((n:any)=>{return n._id == z._id})
          this.dataUjian[i] = z
          this.ujians[n] = z
          this._data.socket.emit('loadData',z)
          if(this.dataAgama.length == i+1){
            let dataToken = {'token':z.token,'kelas':z.kelas.split(',')[0].split('')[0]}
            this._data.socket.emit('kirimToken',dataToken)
            console.log('aray jalan');
          }
          if(this.dataAgama.length == g+1 ){
            let dataToken = {'token':z.token,'kelas':z.kelas.split(',')[0].split('')[0]}
            this._data.socket.emit('kirimToken',dataToken)
          }
        })
      })

    }
  }

  closeUjian(id:string){
    this._data.postData({'_id':id,'status':'Off','token':null,'lock':false},'tabelUjian').subscribe(d=>{
      this._data.info('Ujian di hapus')
      this._data.socket.emit('loadData',d)
      this._data.socket.emit('mapel',d)
      let dataToken = {'token':d.token,'kelas':d.kelas.split(',')[0].split('')[0]}
      this._data.socket.emit('kirimToken',dataToken)
    })
  }

  resetUjian(){
    this._data.getData('tabelUjian&jenis&Harian').subscribe((a:any)=>{
      a.forEach((el:any,i:number)=>{
        el.status = 'Off'
        this._data.updateData('tabelUjian',el).subscribe(c=>{})
        this._data.socket.emit('loadData',el)
        if(a.length == i+1){

          this._data.info('Sudah di reset semua')
        }
      })
    })
  }

  resetPeserta(kelas:number){
    // if(kelas == 7)
    let sis = []
    this._data.getData('tabelSiswa&status&aktif').subscribe((a:any)=>{
      let n = 0
      // console.log(a.kelas);
      if(kelas == 7){
        sis = a.filter((b:any)=>{return b.kelas.split('')[0] == 7})
      }else if(kelas == 8){
        sis = a.filter((b:any)=>{return b.kelas.split('')[0] == 8})
      }else{
        sis = a.filter((b:any)=>{return b.kelas.split('')[0] == 9})
      }
      sis.forEach((el:any,i:number)=>{
        el.go_ujian = 'Belum login'
        this._data.updateData('tabelSiswa',el).subscribe(c=>{
          // console.log(c);
          n++
        //   console.log('sukses hapus');
          if(sis.length == n){
            console.log(n);

            this._data.socket.emit('resetPeserta',kelas)
            this._data.info('Sudah di reset semua')
          }
        })
        // console.log(el);

        // console.log(el);

      })
    })
  }

  resetSiswa(data:any){
    data.go_ujian = 'Belum login'
    this._data.updateData('tabelSiswa',data).subscribe((c:any)=>{
      // console.log(c);
      this._data.socket.emit('resetSiswa',c._id)
      // console.log('sukses hapus');
    })
  }

  loadTotalan(){
    this._data.getTotal('tabelSiswa&status&aktif&go_ujian&Belum login').subscribe(a=>{
      // console.log(a);
      this.blogin = Number(a)
    })
    this._data.getTotal('tabelSiswa&status&aktif&go_ujian&Standby').subscribe(a=>{
      // console.log(a);
      this.stby = Number(a)
    })

    this._data.getTotal('tabelSiswa&status&aktif&go_ujian&Selesai').subscribe(a=>{
      // console.log(a);
      this.selesai = Number(a)
    })

    this._data.getTotal('tabelSiswa&status&aktif&go_ujian&Sedang ujian').subscribe(a=>{
      // console.log(a);
      this.inrun = Number(a)
    })
  }

  loadToken(){
    this.dataToken = [
      {'kelas':7,'token':null},
      {'kelas':8,'token':null},
      {'kelas':9,'token':null}
    ]
    this._data.getData('tabelUjian&lock&true').subscribe((a:any)=>{
      // console.log(this._data.sortAsc(a,'kelas'));
      // if()

      a.forEach((al:any,i:number)=>{
        this.dataToken[this.dataToken.findIndex((s:any)=>{return s.kelas  == al.kelas.split("")[0]})].token = al.token
        // console.log(al);

      })
    })
  }

  captureSiswa(id:string,siswa:string){
    // console.log(id);
    this.imgCap = null
    this._data.socket.emit('capture siswa',{'id_siswa':id,'nama_siswa':siswa,'id_guru':sessionStorage.getItem('id_guru')})
  }
}
