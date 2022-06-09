import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-tabung-soal',
  templateUrl: './tabung-soal.component.html',
  styleUrls: ['./tabung-soal.component.css']
})
export class TabungSoalComponent implements OnInit {

  modul:any = {
    formula: true,
    toolbar : [
      ['bold', 'italic', 'underline'],        // toggled buttons
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript

      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

      [{ 'color': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      ['video'],

      ['formula']

    ]
  }
    doubles:any
    total:number = 0
    sisa:number = 0
    limit:number = 0
    hal:number = 1
    skip:number = 0
    idSoal:string = ''
    opsi:string = 'null'
    cari:string = ''
    editor:string = 'null'
    soal:any = {}
    dataMapel:any
    // dataMapelDuplicate:any
    dataGambar:any = []
    dataSoal:any
    dataSoales:any
    tabs:string = 'soal'
    showImage:boolean = false
    imgFor:string = ''
    baseUrl:string =''
    fileName:string = ''
    // files!: File;
    file_loc:any

  constructor(private _data:DataService, private router:Router) {
    this.baseUrl = _data.url

   }

  ngOnInit(): void {
    this.limit = 5
    if(this._data.dataSoal){
      this.soal = this._data.dataSoal
    }else{
      this.soal.soal=''
      this.soal.opsiA=''
      this.soal.opsiB=''
      this.soal.opsiC=''
      this.soal.opsiD=''
    }

    this.loadMapel()
  }

  pilihOpsi(obj:string){
    console.log(obj);
    this.opsi = obj
    this.soal.jawaban = obj
  }

  openTab(obj:string){
    // this.editor = obj
    this.tabs = obj
    if(obj == 'list'){
      this.loadSoalSendiri()
    }
  }

  sisipImage(img:string){
    console.log(img);
    console.log(this.imgFor);
    this.soal[this.imgFor] += "<img style='width:300px;padding:5px' src="+this.baseUrl+img+" >"
    this.showImage = false
  }

  galeriImage(jenis:string){
    this.imgFor = jenis
    this.showImage = true
    this.loadGambar()
  }

  simpan(){
    this.saved(this.soal)
    console.log(this.soal);

  }

  saved(arr:any){

    let object = ["mapel","tingkat","soal","opsiA","opsiB","opsiC","opsiD","jawaban"]
    let acc = true
    arr.tgl = new Date()
    arr.id_guru = sessionStorage.getItem('id_guru')
    arr.nama_guru = sessionStorage.getItem('nama_guru')
    object.forEach((key)=>{
      if(arr[key] == '' || arr[key] == undefined){
        this._data.info(key+ " harus di isi ")
        acc = false
      }
      // console.log(m);

    })
    if(acc){
      console.log(arr);
      this._data.loading = true
      this._data.postData(arr,'tabelSoal').subscribe(a=>{
        this._data.loading = false
        if(this.soal._id){
          this._data.info("Soal sukses di revisi")
          if(this._data.dataSoal){
            this.soal.soal = ''
            this.soal.opsiA = ''
            this.soal.opsiB = ''
            this.soal.opsiC = ''
            this.soal.opsiD = ''
            this.soal.jawaban = ''
            this.opsi = ''
            this.soal._id = ''
            this.router.navigate(['/dashboard/koleksiSoal'])
          }else{
            this.tabs = 'list'
            this.loadSoalSendiri()
            this.soal.soal = ''
            this.soal.opsiA = ''
            this.soal.opsiB = ''
            this.soal.opsiC = ''
            this.soal.opsiD = ''
            this.soal.jawaban = ''
            this.opsi = ''
            this.soal._id = ''
          }
        }else{
          this._data.info("Soal di tambahkan")
          this.soal.soal = ''
          this.soal.opsiA = ''
          this.soal.opsiB = ''
          this.soal.opsiC = ''
          this.soal.opsiD = ''
          this.soal.jawaban = ''
          this.opsi = ''
        }
      })
    }
    // console.log(arr);

  }

  loadMapel(){
    this._data.loading = true
    this._data.getData("tabelNgajar&id_guru&"+sessionStorage.getItem('id_guru')).subscribe((a:any)=>{
      let cek:any = []
      a.forEach((el:any,i:number)=>{
        if(cek.findIndex((b:any)=>{return b.mapel == el.mapel}) == -1){
          cek.push(el)
        }
        if(a.length == i+1){
          this.dataMapel = cek

        }
      })
      // this.dataMapel = a
      // this.dataMapelDuplicate = a
      this._data.loading = false
      if(a.length){
      this.soal.mapel = a[0].mapel
      this.soal.tingkat = a[0].kelas.split(',')[0].split('')[0]
      }
      // this.pilihTingkat()
      // console.log(a);

    })
  }

  // async pilihTingkat(){
  //   if(this.soal.tingkat){
  //     this.dataMapel = await this.dataMapelDuplicate
  //     // setTimeout(()=>{
  //       this.dataMapel = await this.dataMapel.filter((a:any)=>{return a.tingkat == this.soal.tingkat})
  //       // this.soal.mapel = this.dataMapel[0].mapel
  //       console.log(this.dataMapel);
  //     // },100)
  //   }

  // }

  loadGambar(){
    // this.dataGambar = []
    this._data.loading = true
    this._data.getData("tabelGambar&mapel&"+this.soal.mapel).subscribe((a:any)=>{
      this.dataGambar = a.reverse()
      // console.log(a);
      this._data.loading = false
    })
  }

  upload(event:any){
    this._data.loading = true
    let files = <File>event.target.files[0];
    const fileUpload:FormData = new FormData()
    fileUpload.append('image',files, this.fileName)
    this._data.uploadImage(fileUpload).subscribe((a:any)=>{
      if(a){
        console.log('sukses upload');
        console.log(a);
        if(this.soal.mapel){
          this._data.postData({'mapel':this.soal.mapel,'nama_file':a.fileName.split('&')[1],'image':a.fileName},'tabelGambar').subscribe(b=>{
            this._data.info('Gambar sukses upload')
            // this.showImage = false
            this.dataGambar.push(b)
            // this.loadGambar()
            this.fileName = ''
            this._data.loading = false
          })
        }else{
          this._data.info("Tentukan mapel dulu ya")
          this.showImage = false
        }
      }else{
        console.log('gagal upload');
        this._data.info("gagal Upload ada kesalahan")
      }
    })
    console.log(files.name);

  }


  importExcel(e:any){
    let obj = ["soal","opsiA","opsiB","opsiC","opsiD","jawaban"]

    let data:any = []
    this._data.importExcel(e).then((a:any)=>{
      // console.log(Object.keys(a[0]));
      this._data.cekFormatExcel(Object.keys(a[0]),obj).then(w=>{
       if(!w){
          a.forEach((el:any,i:number) => {
            el.id_guru = sessionStorage.getItem('id_guru')
            el.nama_guru = sessionStorage.getItem('nama_guru')
            if(el.gambarSoal){
              el.soal += "<img src='"+el.gambarSoal+"'>"
              delete el.gambarSoal
            }
            if(el.gambarA){
              el.opsiA += "<img src='"+el.gambarA+"'>"
              delete el.gambarA
            }
            if(el.gambarB){
              el.opsiB += "<img src='"+el.gambarB+"'>"
              delete el.gambarB
            }
            if(el.gambarC){
              el.opsiC += "<img src='"+el.gambarC+"'>"
              delete el.gambarC
            }
            if(el.gambarD){
              el.opsiD += "<img src='"+el.gambarD+"'>"
              delete el.gambarD
            }
            data.push(el)
            if(a.length == i+1){
              console.log(data);
              this.dataSoal = data

            }
          });
       }else{
         this._data.info("Format excel salah")
       }
      })

    })
  }

  downloadExcel(){
    this._data.exportExcel('excel','format soal')
  }

  delArray(i:number){
    this.dataSoal.splice(i,1)
  }

  simpanArreay(){
    // console.log(this.dataSoal);
    this._data.loading = true
    let n = 0
    if(this.soal.tingkat != undefined && this.soal.mapel != undefined){
      this.dataSoal.forEach((el:any) => {
        n++
        el.tingkat = this.soal.tingkat
        el.mapel = this.soal.mapel
        this.saved(el)
        if(this.dataSoal.length == n){
          this.openTab('list')
          this.dataSoal = null
        }
      });
      this._data.loading = false
    }else{
      this._data.info("Lengkapi mata pelajaran dan kelas dulu")
    }

  }

  loadSoalSendiri(){
    this._data.loading = true
    this._data.selectData("tabelSoal&id_guru&"+sessionStorage.getItem('id_guru')+"&mapel&"+this.soal.mapel+"&tingkat&"+this.soal.tingkat,this.limit,this.skip).subscribe((a:any)=>{
      this.dataSoales = a
      console.log(a);

      this.doubles = a
      this._data.getTotal("tabelSoal&id_guru&"+sessionStorage.getItem('id_guru')+"&mapel&"+this.soal.mapel).subscribe(m=>{
        this.total = Number(m)
        this.sisa = Math.ceil(Number(m) / this.limit)
        // console.log(m);
        this._data.loading = false
      })
    })
  }

  showFull(id:string){
    this.idSoal = id
  }

  next(){
    this.cari = ''
    let jum = Math.ceil(this.total / this.limit)
    if(this.hal != jum){
      this.hal++
      this.skip = this.hal * this.limit - this.limit

      this.loadSoalSendiri()
    }
    // console.log(jum);

  }
  prev(){
    this.cari = ''
    if(this.hal > 1){
      this.hal--
      this.skip = this.hal * this.limit - this.limit
      this.loadSoalSendiri()
    }else{
      this.hal = 1
      this.skip = 0
    }
  }

  gantiKelas(){
    this.dataSoales =  this.doubles.filter((a:any)=>{return a.tingkat == this.soal.tingkat})
  }

  editan(so:any){
    this.soal = so
    this.tabs = 'soal'
  }

  cariSemuaSoal(){
    this._data.getData("tabelSoall&id_guru&"+sessionStorage.getItem('id_guru')+"&mapel&"+this.soal.mapel+"&tingkat&"+this.soal.tingkat).subscribe((a:any)=>{
      this.dataSoales = a
      this.limit = 5
      this.total = a.length
      this.skip = 0
      this.hal = 1
    })
  }

  autoHapus(img:string){
    // this._data.info(img)
    console.log(img);
    this._data.deleteData('tabelGambar',img).subscribe(a=>{
      console.log('auto hapus yg error 404');

    })
  }
}
