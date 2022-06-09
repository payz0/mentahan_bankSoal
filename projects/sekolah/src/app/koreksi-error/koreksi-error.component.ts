import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-koreksi-error',
  templateUrl: './koreksi-error.component.html',
  styleUrls: ['./koreksi-error.component.css']
})
export class KoreksiErrorComponent implements OnInit {
  allMapel:any
  mapel:string = ""
  tahun:number = Number(new Date().getMonth() < 7 ? Number(new Date().getFullYear()-1).toString() : new Date().getFullYear().toString())
  kelas:string = "7A"
  kelases:any = ["7A","7B","7C","7D","7E","7F","8A","8B","8C","8D","8E","8F","9A","9B","9C","9D","9E","9F"]
  allJawaban:any = []
  allTahun:any
  // tahunBaru:number = 0

  constructor(private _data:DataService) { }

  ngOnInit(): void {
    this.getMapel()
  }

  getJawaban(mapel:string,kelas:string,tahun:number){
    this._data.loading = true
    this.allJawaban = []
    this._data.getData('tabelJawaban&mapel&'+mapel+'&tahun_ajaran&'+tahun).subscribe((e:any)=>{
      console.log(e);
      // if(e.length)
      if(!e.length){
        this._data.loading = false
        this._data.info('Data tidak ada error')
      }else{
        e.forEach(async(el:any,i:number)=>{
          if(el.jawab_soal.split(',').length > el.jumlah_soal){
            this.cekDataSoal(el.id_ujian,el.jawab_soal).then((r:any)=>{
              this._data.getData('tabelSiswa&_id&'+el.id_siswa).subscribe((m:any)=>{
                this.allJawaban.push({...el,...{'kelas':m[0].kelas,'siswa':m[0].nama_siswa,'soal_baru':r[1],'revisiJuml':r[1].split(',').length,'koreksi_jumlah':el.jawab_soal.split(',').length,'korekBetul':r[0],'newNilai':100/el.jumlah_soal*r[0]}})
              })
            })
          }
          if(e.length == i+1){
            console.log(this.allJawaban);
            if(!this.allJawaban.length){
              this._data.info('Data tidak ada error')
            }
            this._data.loading = false
            setTimeout(()=>{
              this.allJawaban = this._data.sortAsc(this.allJawaban,'kelas')
            },400)
          }

        })
      }
    })
  }

  tampilkan(){
    console.log(this.mapel,this.kelas,this.tahun);

    this.getJawaban(this.mapel,this.kelas,this.tahun)
  }

  getMapel(){
    this._data.getData('tabelMapel&tingkat&7').subscribe((a:any)=>{
      // console.log(a);
      this.allMapel = a
      this.mapel = a[0].mapel
    })
  }

  cekDataSoal(id:string,arr:string){
    // if(!id){
    //   this._data.loading = false
    // }
    return new Promise((resolve,reject)=>{
      // console.log(id);
      // this._data.getData('tabelKoleksiSoal&_id&'+id).subscribe((a:any)=>{
        let dat:any = []
        let betul = 0
        let tot = 0
        let tet = 0

        arr.split(',').forEach((el:any,d:number)=>{

          this._data.getData('tabelSoal&_id&'+el.split('&')[0]).subscribe((z:any)=>{
            tet++
              let i = dat.findIndex((h:any)=>{return h.split('&')[0] == el.split('&')[0]})
          //     if(a[0].jawaban == el.split('&')[1]){
          //       betul++
          //     }
              if(z[0].mapel == this.mapel){

              if( i == -1){
                dat.push(el)
              }else{
                console.log(el);
              }
            }

                // if(a[0].jawaban == el.split('&')[1]){
                //   dat[i] == el
                // }


              if(arr.split(',').length == tet){
                // console.log(dat);
                  // console.log(betul);
                  // resolve(betul)
                  if(dat.length){
                    dat.forEach((lir:any)=>{
                      this._data.getData('tabelSoal&_id&'+lir.split('&')[0]).subscribe((a:any)=>{
                        tot++
                        if(a[0].jawaban == lir.split('&')[1]){
                          betul++
                        }
                        if(dat.length == tot){
                          console.log(dat.length);
                          console.log(betul);
                          resolve([betul,dat.join(',')])
                        }
                      })
                    })
                  }
                }
          })


        })
    })
  }

  update(vl:any){
    console.log(vl);
    let data = {'_id':vl._id,'jawaban_betul':vl.korekBetul,'jawab_soal':vl.soal_baru,'nilai':vl.newNilai}
    console.log(data);
    console.log(data.jawab_soal.split(',').length);

    this._data.updateData('tabelJawaban',data).subscribe(g=>{
      this._data.info('sukses update')
      console.log(g);

    })
  }

  cekTahunUjian(){
    // this._data.loading = true
    // this._data.getData('tabelUjian&mapel&'+this.mapel+'&tahun_ajaran&'+this.tahun).subscribe((e:any)=>{
    //   console.log(e);
    //   let data:any = []
    //   if(e.length){
    //   e.forEach((el:any,i:number)=>{
    //     this._data.getTotal('tabelJawaban&id_ujian&'+el.id_koleksi_soal+'&tahun_ajaran&'+this.tahun+'&tgl_ujian&'+el.tgl_ujian).subscribe(r=>{
    //       console.log(r+"/n");
    //       if(r != 0){
    //         data.push({'_id':el._id,'idUjian':el.id_ujian,'tahun':el.tahun_ajaran,'nama_ujian':el.nama_ujian,'tgl':el.tgl_ujian})
    //       }
    //       if(e.length == i+1){
    //         console.log(data);
    //         this.allTahun = data
    //         this._data.loading = false
    //         if(!data.length){
    //           this._data.info('Data tidak ditemukan')
    //         }
    //       }
    //     })
    //   })
    //   }else{
    //     this.allTahun = []
    //     this._data.loading = false
    //     this._data.info('Data tidak ditemukan')
    //   }

    // })
    this._data.loading = true
    this._data.getTotal('tabelJawaban&mapel&'+this.mapel+'&tahun_ajaran&'+this.tahun).subscribe(e=>{
      console.log(e);

      if(e != 0){
        this._data.getData('tabelJawaban&mapel&'+this.mapel+'&tahun_ajaran&'+this.tahun).subscribe((n:any)=>{
          let data:any = []
            n.forEach((el:any,m:number)=>{
              let i = data.findIndex((k:any)=>{return k.idUjian == el.id_ujian && k.tgl == el.tgl_ujian && k.nama_ujian == el.nama_ujian})
              if(i == -1){
                data.push({'_id':el._id,'idUjian':el.id_ujian,'tahun':el.tahun_ajaran,'nama_ujian':el.nama_ujian,'tgl':el.tgl_ujian})
              }
              if(n.length == m+1){
                console.log(data);
                this.allTahun = data
                this._data.loading = false
              }
            })
        })
      }else{
        this.allTahun = []
        this._data.info('Data tidak ditemukan')
        this._data.loading = false
      }

    })

  }

  updateTahun(al:any){
    console.log(al);
    console.log(this.tahun);
    let nama_ujian = al.nama_ujian.split(' ').join('%20')
    let tgl = al.tgl.split('/').join('%2F')
    console.log(al.tgl);

    this._data.getData('tabelJawaban&mapel&'+this.mapel+'&nama_ujian&'+nama_ujian+'&tgl_ujian&'+tgl).subscribe((r:any)=>{
      console.log(r);
      r.forEach((el:any) => {
        this._data.updateData('tabelJawaban',{'_id':el._id,'tahun_ajaran':al.tahun}).subscribe(t=>{
          console.log('sukses update');

        })
      });

    })

  }
}
