import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  dataLogin:any ={}

  constructor(private router:Router, private _data:DataService) { }

  ngOnInit(): void {
    this.dataLogin.sebagai = ''
  }

  login(){
    this._data.loading = true
    this._data.getData('tabelGuru&nip&'+this.dataLogin.nip).subscribe((a:any)=>{
      this._data.loading = false
      if(a.length){
        if(a[0].password != this.dataLogin.password){
          this._data.info("Password tidak di sesuai")
        }else if(a[0].sebagai != this.dataLogin.sebagai){
          this._data.info("Tidak bisa sebagai "+this.dataLogin.sebagai)
        }else{

          sessionStorage.setItem('id_guru',a[0]._id)
          sessionStorage.setItem('nama_guru',a[0].nama_guru)
          sessionStorage.setItem('sebagai',a[0].sebagai)
          sessionStorage.setItem('login','true')
          this.router.navigate(['/dashboard/monitoring'])
        }
      }else{
        this._data.info("Akun tidak di temukan")
      }
      this.dataLogin = {}
    })
    // this.router.navigate(['/dashboard/guru'])
  }
}


