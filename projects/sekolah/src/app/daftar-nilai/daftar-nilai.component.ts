import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../data.service';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-daftar-nilai',
  templateUrl: './daftar-nilai.component.html',
  styleUrls: ['./daftar-nilai.component.css']
})
export class DaftarNilaiComponent implements OnInit {
  dataNilai:any
  nilaiSemester:any
  dataSiswa:any
  dataNgajar:any
  dataKelas:any
  tabs:string = 'semesteran'
  tahun_ajaran:string = new Date().getMonth() < 7 ? Number(new Date().getFullYear()-1).toString() : new Date().getFullYear().toString()
  nilai:any = {}
  dataSoal:any
  showSoal:boolean = false
  semester:string = new Date().getMonth() < 7 ? 'Genap' : 'Ganjil'
  siswas:any = {}
  sebagai:any = sessionStorage.getItem('sebagai')
  korekNilai:number = 0
  korekJawaban:number = 0
  indx:number = -1
  salahKoreksi:boolean = false
  deleted:boolean = false
  singleData:boolean = false
  downExcel:boolean = false
  listTahun:any = []
  constructor(private _data:DataService) { }

  ngOnInit(): void {
  this.loadNgajar()
  this.cekKelasNull()
  this.tahunAjar()
  }


  cekJumlSoal(){
    // console.log(this.nilai.mapel);
    console.log('loading ..');

    let tot = 0
    let toterr = 0
    // let jum = 40
    let idja:any = []
    this._data.getData('tabelJawaban&tahun_ajaran&2022').subscribe((c:any)=>{
      // console.log(c);
      console.log('wooy');

      let data:any = []
      c.forEach((el:any)=>{
        tot++
        let i = data.findIndex((d:any)=>{ return d.id_ujian == el.id_ujian})
        if(i == -1){
          if(el.jumlah_soal != null){
            data.push({id_ujian:el.id_ujian,jumlah_soal:el.jumlah_soal,id_siswa:el.id_siswa,jum_before:el.jumlah_soal,mapel:el.mapel})
          }
        }
        else{

          if(data[i].jumlah_soal != el.jumlah_soal ){
            let jum_soal
            let jum_salah
            if(data[i].jumlah_soal > el.jumlah_soal){
              jum_soal = data[i].jumlah_soal
              jum_salah = el.jumlah_soal
            }else{
              jum_soal = el.jumlah_soal
              jum_salah = data[i].jumlah_soal
            }

            toterr++
            if(idja.findIndex((d:any)=>{ return d.id == el._id}) == -1){
              idja.push({'id':el._id,'jum_soal':jum_soal,'mapel':el.mapel,'jawaban_betul':el.jawaban_betul,'nilai':el.nilai,'kelas':el.kelas,'jumSalah':jum_salah})
            }
          }
        }
        if(c.length == tot){
          console.log('loading finish');

          console.log(data);
          console.log(idja);
          // this._data.updateData('tabelJawaban',{'_id':'622ea5822610674e6372736a','jumlah_soal':43}).subscribe(a=>{
          //   console.log('update');

          // })
          if(idja.length){
            console.log('di koreksi');
            idja.forEach((il:any)=>{
            //   if(il.mapel == "Pendidikan Jasmani, Olahraga dan Kesehatan"){
                // if(il.kelas.split('')[0] == 8 || il.kelas.split('')[0] == 7){
                //   this.daruratKoreksiNilai(il.id,40,il.jawaban_betul)
                // }else{
                  this.daruratKoreksiNilai(il.id,50,il.jawaban_betul)
                // }

            //   }
            })

          }

        }
      })
    })
  }
  daruratKoreksiNilai(id:string,juml:number,jawab:number){
    // console.log('haii');


      // console.log('aa');
      // this._data.getData('tabelUjian&id_ujian&6210b0d06e75cb3382cc0e42').subscribe((a:any)=>{
      //   console.log(a);

      // })
      // arr.forEach((m:any)=>{
      //   if(m.jumlah_soal < jum){
      //   console.log("total "+m.jumlah_soal," betul ", m.jawaban_betul," nilai ", m.nilai, "nilai koreksi : "+100/jum*m.jawaban_betul);
      //     console.log('ada nih ');

        // update nilai
        this._data.updateData('tabelJawaban',{'_id':id, 'jumlah_soal':juml,'nilai':100/juml*jawab}).subscribe(d=>{
          console.log(d);

        })
        // }

      // })
    //   this._data.getData('tabelSiswa&_id&'+c[2].id_siswa).subscribe(a=>{
    //     console.log(a);

    //   })
    // })
  }

  tahunAjar(){
    this._data.loading = true
    for(let i = 10; 1 <= i;i--){
      // console.log(i);
      this.listTahun.push(Number(this.tahun_ajaran)-i)
      if(i == 9){
        // console.log(this.listTahun);

      }
    }
    for(let i = 0; 10 > i;i++){
      // console.log(i);
      this.listTahun.push(Number(this.tahun_ajaran)+i)
      if(i == 9){
        // console.log(this.listTahun);
        this._data.loading = false
      }
    }

  }

  cekKelasNull(){
    this._data.getTotal('tabelJawaban&kelas').subscribe((n:any)=>{
      let roll = 0
      if(n != 0){
        this._data.getData('tabelJawaban&kelas').subscribe((a:any)=>{
          a.forEach((el:any)=>{
            roll++
            if(el.id_siswa != undefined){
              this._data.getData('tabelSiswa&_id&'+el.id_siswa).subscribe((g:any)=>{
                this._data.updateData('tabelJawaban',{'_id':el._id,'kelas':g[0].kelas}).subscribe((z:any)=>{
                  console.log('sukses update');
                  // if(a.length == roll){
                  //   location.reload();
                  // }
                })
              })
            }
          })

        })
      }else{
        console.log('tidak ada yg null kelas');

      }
    })

  }

  selectNilai(){
    this.dataNilai  = this.nilaiSemester.filter((a:any)=>{return a.semester == this.semester})
  }

  // loadNilai(){
  //   this._data.loading = true
  //   // let data:any = []
  //   this._data.getData('tabelJawaban&kelas&'+this.nilai.kelas+'&mapel&'+this.nilai.mapel.split('&')[0]+'&tahun_ajaran&'+this.tahun_ajaran).subscribe((a:any)=>{
  //     if(this.tabs == 'harian'){
  //      this.nilaiSemester =  this.dataNilai = a.filter((b:any)=>{return b.jenis_ujian == 'Harian'})
  //     }else{
  //       this.nilaiSemester =  this.dataNilai = a.filter((b:any)=>{return b.jenis_ujian == 'PTS' || b.jenis_ujian == 'PAS'})
  //     }

  //     if(this.nilai.mapel.split('&')[0] == 'Simulasi'){
  //       this.nilaiSemester =  this.dataNilai = a.filter((b:any)=>{return b.jenis_ujian == 'Simulasi'})
  //     }

  //     console.log(this.dataNilai);
  //     this.selectNilai()
  //     this._data.loading = false
  //   })
  // }

  loadSiswa(){
    // console.log(this.nilai.mapel);

    this._data.loading = true
    let cari = 'kelas&'+this.nilai.kelas
    let agama = this.nilai.mapel.split(" ")[2] ? this.nilai.mapel.split(" ")[2]:null
    let mapel
    if(this.nilai.mapel.split(" ")[1] == 'Agama'){
      cari = 'kelas&'+this.nilai.kelas+'&agama&'+agama
    }
    // this.nilai.mapel = 'SImulasi'
    this._data.getData('tabelSiswa&'+cari).subscribe((a:any)=>{
      // console.log(a);
      if(this.nilai.mapel.indexOf(' ') >= 0){
        mapel = this.nilai.mapel.split('&')[0].split(' ').join('%20');
      }else{
        mapel = this.nilai.mapel.split('&')[0]
      }
      // console.log(this.tahun_ajaran);

      this._data.getData('tabelJawaban&kelas&'+this.nilai.kelas+'&mapel&'+mapel+'&tahun_ajaran&'+this.tahun_ajaran).subscribe((n:any)=>{
        // console.log(n);
        if(n.length == 0){
          this._data.loading = false
          this.nilaiSemester = []
          this.dataSiswa = this._data.sortAsc(a,'nama_siswa')
        }else{
          this.dataNilai = []
          let total = 0
          n.forEach((al:any,k:number)=>{
            // console.log(al._id);
            total++
            // console.log(al,total);

            // if(typeof al.kelas === undefined || al.kelas == null){
            //   console.log(
            //     'typeof al.kelas'
            //   )
            //   }
            let i = a.findIndex((k:any)=>{return k._id == al.id_siswa})
            let tgl = this.dataNilai.findIndex((k:any)=>{return k.tgl_ujian == al.tgl_ujian && k.nama_ujian == al.nama_ujian})
            if(i != -1){
              a[i]['nilai'] = n.filter((f:any)=>{return f.id_siswa == a[i]._id})
            }

            if(tgl == -1){
              this.dataNilai.push({id_ujian:al.id_ujian,kelas:this.nilai.kelas,tgl_ujian:al.tgl_ujian,nama_ujian:al.nama_ujian,semester:al.semester,tahun_ajaran:al.tahun_ajaran,jenis_ujian:al.jenis_ujian})
            }
            if(n.length == total){


              this.nilaiSemester = this.dataNilai
              this.dataSiswa = this._data.sortAsc(a,'nama_siswa')
              // console.log(this.dataNilai);
              // console.log(a[2].nilai[0].jawab_soal.split(',').length);

              if(this.sebagai == 'admin'){
                this.openTab('simulasi')
              }else{
                this.openTab('semesteran')
              }
              this._data.loading = false
            }

          })

        }

      })
      // console.log(a);


    })
  }

  loadNgajar(){
    // console.log('loading ngajar');

    this._data.loading = true
    this._data.getData('tabelNgajar&id_guru&'+sessionStorage.getItem('id_guru')).subscribe((a:any)=>{
      // this.dataNgajar = a
      // console.log(a);

      this._data.loading = false
      // console.log(a);
      this.nilai.mapel = a[0].mapel+'&'+a[0].kelas
      this.dataKelas = a[0].kelas.split(',')
      this.nilai.kelas = a[0].kelas.split(',')[0]
      // console.log(a[0].kelas.split(',')[0]);
      // let n = 0
      a.forEach((el:any,i:number) => {
        // n++
        if(el.kelas){
          el.tingkat = el.kelas.split(',')[0].split('')[0]
        }
        if(a.length == i+1){
          // console.log('selesai');

          // console.log(a[0].mapel);
          this.dataNgajar = a
          // this.loadNilai()
          this.loadSiswa()
          // console.log(this.nilai);

        }
      });

    })
  }

  openTab(tab:string){
    this.tabs = tab
    if(tab == 'harian'){
      this.dataNilai = this.nilaiSemester.filter((a:any)=>{return a.jenis_ujian == 'Harian'})
    }else if(tab == 'simulasi'){
      this.dataNilai = this.nilaiSemester.filter((a:any)=>{return a.jenis_ujian == 'Simulasi'})
    }else{
      this.dataNilai = this.nilaiSemester.filter((a:any)=>{return a.jenis_ujian == 'PTS' || a.jenis_ujian == 'PAS' })
    }

    // this.loadNilai()
  }

  getKelas(e:any){
    this.dataKelas = e.target.value.split('&')[1].split(',')
    this.nilai.kelas = e.target.value.split('&')[1].split(',')[0]
    // this.loadNilai()
    this.loadSiswa()
  }

  changeKelas(){
    // this.loadNilai()
    this.loadSiswa()
  }

  riwayat(val:any,siswa:any,indx:number){
    // console.log(val);

    this.salahKoreksi = false
    this.indx = indx
    this.korekJawaban = 0
    this.korekNilai = 0
    let z = 0
    let total = 0
    this.siswas = val
    this.siswas.nama_siswa = siswa.nama_siswa
    this.showSoal = true
    this.dataSoal = []
    if(val.jawab_soal){
      this._data.loading = true
      val.jawab_soal.split(',').forEach((el:any)=>{
        let id = el.split('&')[0]
        this._data.getData('tabelSoal&_id&'+id).subscribe((w:any)=>{
          total++
          w[0]['jawaban_siswa'] = el.split('&')[1]
          this.dataSoal.push(w[0])
          // console.log(w[0]);
          if(el.split('&')[1] == w[0].jawaban){
            // n.push(w[0].jawaban)
            z++
            this.korekJawaban++
            this.korekNilai = 100/(val.jumlah_soal ? val.jumlah_soal : val.jawab_soal.split(',').length) * this.korekJawaban
            // console.log(z);
            // this.siswas.jawaban_betul = z
          }
          if(val.jawab_soal.split(',').length == total){
            // console.log(val.jawab_soal.split(',').length);
            // console.log(val.jawaban_betul);
            this._data.loading = false
            this.siswas.jumlah_soal = val.jumlah_soal ? val.jumlah_soal : total
            if(val.jawaban_betul != z || this.korekNilai != val.nilai){
              this.salahKoreksi = true
              // console.log(val.jawaban_betul+' betul = '+z);
            }
          }
        })
      })
    }else{
      this._data.info("Siswa tidak menjawab semua soal")
      this.showSoal = false
    }

  }

  perbaikiNilai(){
    this._data.updateData('tabelJawaban',{'_id':this.siswas._id,jawaban_betul:this.korekJawaban,nilai:100/this.siswas.jumlah_soal*this.korekJawaban}).subscribe((a:any)=>{
      this.dataSiswa[this.indx].nilai[this.dataSiswa[this.indx].nilai.findIndex((h:any)=>{return h._id == a._id})] = a
      this.showSoal = false
      this._data.info('Koreksi sudah di perbaiki')
    })
  }

  dataJawaban(nil:any){
    this.deleted = false
    this.siswas = {}
    let tgl = nil.tgl_ujian.split('/').join('%2F')
    console.log(tgl);
    this._data.getData('tabelJawaban&tgl_ujian&'+tgl+'&kelas&'+nil.kelas+'&id_ujian&'+nil.id_ujian).subscribe((a:any)=>{
      console.log(a);
      let n = 0
      a.forEach((el:any) => {
        this._data.deleteData('tabelJawaban',el._id).subscribe(b=>{
          n++
          if(a.length == n){
            this.loadSiswa()
            this._data.info('Nilai ujian sudah di hapus')
          }
        })

      });

    })
  }

  async hapusNilai(id:any){
    console.log(id);
    this.deleted = false
    let i = await this.dataSiswa.findIndex((a:any)=>{return a._id == id.id_siswa})
    let m = await this.dataSiswa[i].nilai.findIndex((a:any)=>{return a._id == id._id})
    this._data.deleteData('tabelJawaban',id._id).subscribe(a=>{
      this.dataSiswa[i].nilai.splice(m,1)
      this.siswas = {}
      this._data.info('Sudah di hapus')
      this.singleData = false
    })

  }

  cekNilai(arr:any,tgl:any){
    if(arr.filter((a:any)=>{return a.tgl_ujian == tgl}).length > 1){
      return true
    }else{
      return false
    }
  }

  downloadExcel(){
    this.downExcel = true

    setTimeout(()=>{
      this._data.exportExcel('excel','Daftar nilai '+this.nilai.mapel.split('&')[0]+' kelas '+this.nilai.kelas)
      this.downExcel = false
    },1000)
  }

  @ViewChild('content')content!: ElementRef;
  SavePDF(): void {
  //   // html2canvas(this.content.nativeElement).then(canvas => {
  //   //   // Few necessary setting options

  //   //   const contentDataURL = canvas.toDataURL('image/png')
  //   //   let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
  //   //   var width = pdf.internal.pageSize.getWidth();
  //   //   var height = canvas.height * width / canvas.width;
  //   //   pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height)
  //   //   pdf.save('output.pdf'); // Generated PDF
  //   //   });

    // let content = this.content.nativeElement;
    // let pdf = new jsPDF('p','pt','a4');

    // pdf.html(content,{
    //   callback:(pdf)=>{
    //     pdf.save('demo.pdf')
    //   }
    // })

  //   // let _elementHandlers =
  //   // {
  //   //   '#editor':function(element:any,renderer:any){
  //   //     return true;
  //   //   }
  //   // };
  //   // doc.fromHTML(content.innerHTML,15,15,{

  //   //   'width':190,
  //   //   'elementHandlers':_elementHandlers
  //   // });

  //   // doc.save('test.pdf');

  }
}
