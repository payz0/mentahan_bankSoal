import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  profile:any = {}
  tugas:any
  constructor(private _data:DataService) { }

  ngOnInit(): void {
    this.loadProfil()
  }

  loadProfil(){
    this._data.loading = true
    this._data.getData('tabelGuru&_id&'+sessionStorage.getItem('id_guru')).subscribe((a:any)=>{
      this.profile = a[0]
      this._data.getData('tabelNgajar&id_guru&'+sessionStorage.getItem('id_guru')).subscribe(b=>{
        this.tugas =b
        console.log(b);
        this._data.loading = false
      })
    })
  }

  update(){
    this._data.updateData('tabelGuru',this.profile).subscribe(a=>{
      this._data.info('Data sudah di update')
    })
  }

}
