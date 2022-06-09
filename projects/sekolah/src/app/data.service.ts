import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import  socketIo from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  url:string = "https://smpn1arutselatan.sch.id:8443/"
  // url:string = "http://localhost:8888/"
  baseUrl:string = ""
  baseUrlUpload:string = ""
  versiApp:string ="Versi 4.0"
  socket:any = socketIo("https://ppdbkobar.net:2087")
  // socket:any = socketIo("http://36.74.225.224:2087/") //|| socketIo("https://smpn1arutselatan.sch.id:2087")

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': this.url,
    // 'Access-Control-Allow-Credentials': 'true',
    // 'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS',
    // 'Access-Control-Allow-Headers' : 'Origin, Content-Type, Accept'
    // 'auth':  environment.token
    })

  // jawaban:any
  loading:boolean = false
  message:boolean = false
  textPesan:string = ''
  dataSoal:any
  _id:any
  constructor(private _http:HttpClient) {
    this.baseUrl = this.url+"data/"
    this.baseUrlUpload = this.url+"upload/"
  }

  getTotal(tabel:string){
    return this._http.get(this.url+"totalan/"+tabel,{headers:this.headers})
    .pipe(catchError(this.errorHandler))
  }

  postData(data:any,tabel:string):Observable<any>{
    return this._http.post(this.baseUrl+tabel,data,{headers:this.headers})
    .pipe(catchError(this.errorHandler))
  }

  getData(tabel:string){
    return this._http.get(this.baseUrl+tabel,{headers:this.headers})
    .pipe(catchError(this.errorHandler))
  }

  selectData(tabel:string,limit:number,skip:number){
    return this._http.get(this.baseUrl+tabel+"/"+limit+"/"+skip,{headers:this.headers})
    .pipe(catchError(this.errorHandler))
  }

  updateData(tabel:string, data:any){
    return this._http.put(this.baseUrl+tabel,data,{headers:this.headers})
    .pipe(catchError(this.errorHandler))
  }

  deleteData(tabel:string, id:string){
    return this._http.delete(this.baseUrl+tabel+"/"+id,{headers:this.headers})
    .pipe(catchError(this.errorHandler))
  }

  uploadImage(data:FormData){
    return this._http.post(this.baseUrlUpload,data)
    .pipe(catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }

  importExcel(event:any) {
    return new Promise((resolve,reject)=>{
        let workBook:any = null;
        let jsonData = null;
        const reader = new FileReader();
        reader.readAsBinaryString(event.target.files[0]);
        reader.onload = (e) => {
          workBook =  XLSX.read(reader.result, { type: 'binary' });
          jsonData =  workBook.SheetNames.reduce((initial:any, name:any) => {
            resolve(XLSX.utils.sheet_to_json(workBook.Sheets[name]));
          }, {});
        }
    })
  }

  exportExcel(tabel:string,namaFile:string){
    var workbook = XLSX.utils.book_new();
    var ws = XLSX.utils.table_to_sheet(document.getElementById(tabel));
    console.log(document.getElementById(tabel));

    XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");
    XLSX.writeFile(workbook, namaFile+".xlsx");
  }

  cekFormatExcel(arr:any,keys:any){
    return new Promise((resolve,reject)=>{
      let acc = false
        for(let n = 0; keys.length > n;n++){
          let ind = arr.indexOf(keys[n])
          if( ind == -1 ){
            acc = keys[n]
          }
          if(keys.length == n+1){
            resolve(acc)
          }
        }
    })
  }



  info(pesan:string){
    this.textPesan = pesan
    this.message = true
    setTimeout(()=>{
      this.message = false
    },1000)
  }

  // sorter
  sortAsc(arr:any,obj:any){
    return arr.sort((a:any,b:any)=>{
      if (a[obj] < b[obj] )
        return -1;
      if (a[obj]  > b[obj] )
        return 1;
      return 0;
    })
  }

  sortDesc(arr:any,obj:any){
    return arr.sort((a:any,b:any)=>{
      if (a[obj] < b[obj] )
        return 1;
      if (a[obj]  > b[obj] )
        return -1;
      return 0;
    })
  }

}
