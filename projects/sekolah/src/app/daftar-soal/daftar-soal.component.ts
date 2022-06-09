import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import {Router} from "@angular/router"


@Component({
  selector: 'app-daftar-soal',
  templateUrl: './daftar-soal.component.html',
  styleUrls: ['./daftar-soal.component.css']
})
export class DaftarSoalComponent implements OnInit {

  dataSoal:any = []
  dataMapel:any
  limit:number = 0
  hal:number = 1
  skip:number = 0
  total:number = 0
  sisa:number = 0
  soal:any = {}
  cari:string = ''
  ceklist:boolean = false
  indexs:number = -1
  dataMapelDuplicate:any

  @Input() selectSoal:any = [] // konek ke koleksi soal component
  // @Input() dataSoal:any = []

  constructor(private _data:DataService,private router: Router) {}

  ngOnInit(): void {
    this.limit = 5
    this.loadSoal()

  }

  loadSoal(){
    this._data.loading = true
    this.dataSoal = []
    this._data.getData("tabelNgajar&id_guru&"+sessionStorage.getItem('id_guru')).subscribe((z:any)=>{
      let cekDobel:any = []
      z.forEach((el:any,i:number) => {
        if(cekDobel.findIndex((g:any)=>{return g.mapel == el.mapel}) == -1){
          cekDobel.push(el)
        }
        if(z.length == i+1){
          this.dataMapel = cekDobel
          console.log(cekDobel[0].mapel);


        }
      });

      // console.log(z);

      if(!this.soal.mapel){
        this.soal.mapel = z[0].mapel
        this.soal.tingkat = z[0].kelas.split(',')[0].split('')[0]
      }
        this._data.selectData("tabelSoal&mapel&"+this.soal.mapel+"&tingkat&"+this.soal.tingkat,this.limit,this.skip).subscribe((a:any)=>{
          // this.dataSoal =  a
          // console.log(this.selectSoal);

          a.forEach((al:any,j:number)=>{
            let zet = this.selectSoal.findIndex((w:string)=>{return al._id == w.split('&')[0]})
            if(zet != -1){
              this.selectSoal[zet] = al._id+'&'+al.jawaban
            }
          })
          this.dataMapelDuplicate = a
          this.dataSoal = a.filter((f:any)=>{return f.tingkat == this.soal.tingkat})
          // this.pilihTingkat()
          // console.log(this.soal.tingkat);

          this._data.getTotal("tabelSoal&mapel&"+this.soal.mapel+"&tingkat&"+this.soal.tingkat).subscribe(m=>{
            this.total = Number(m)
            this.sisa = Math.ceil(Number(m) / this.limit)
            // console.log(m);
            this._data.loading = false
          })


        })

    })
  }

  next(){
    this.cari = ''
    let jum = Math.ceil(this.total / this.limit)
    if(this.hal != jum){
      this.hal++
      this.skip = this.hal * this.limit - this.limit

      this.loadSoal()
    }
    // console.log(jum);

  }
  prev(){
    this.cari = ''
    if(this.hal > 1){
      this.hal--
      this.skip = this.hal * this.limit - this.limit
      this.loadSoal()
    }else{
      this.hal = 1
      this.skip = 0
    }

    // console.log(this.dataMapel.mapel);
  }

  editan(data:any){
    this._data.dataSoal = data
    console.log('di pilih');
    this.router.navigate(['/dashboard/tabungSoal'])
  }

  pilihSoal(id:string){
    let ind = this.selectSoal.indexOf(id)
    if(ind == -1){
      this.selectSoal.push(id)
    }else{
      this.selectSoal.splice(ind,1)
    }
    console.log(this.selectSoal);
  }

  cariSemuaSoal(){
    this._data.loading = true
    this._data.getData("tabelSoall&mapel&"+this.soal.mapel+"&tingkat&"+this.soal.tingkat).subscribe((a:any)=>{
      console.log(a);

      this.dataSoal = a
      this.limit = 10
      this.total = a.length
      this.skip = 0
      this.hal = 1
      this._data.loading = false
    })
  }
}
