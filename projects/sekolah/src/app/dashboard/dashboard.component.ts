import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  sebagai:any
  nama_guru:any
  showMenu:boolean = false
  constructor(private router:Router) { }

  ngOnInit(): void {
    if(!sessionStorage.getItem('login')){
      this.router.navigate(['/'])
    }else{
      this.sebagai = sessionStorage.getItem('sebagai')
      this.nama_guru = sessionStorage.getItem('nama_guru')
    }
  }

  logout(){
    sessionStorage.clear()
    this.router.navigate(['/'])
  }

}
