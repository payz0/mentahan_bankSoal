import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DaftarNilaiComponent } from './daftar-nilai/daftar-nilai.component';
import { DaftarSoalComponent } from './daftar-soal/daftar-soal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { InputGuruComponent } from './input-guru/input-guru.component';
import { InputKelasComponent } from './input-kelas/input-kelas.component';
import { InputMapelComponent } from './input-mapel/input-mapel.component';
import { InputSiswaComponent } from './input-siswa/input-siswa.component';
import { KoleksiSoalComponent } from './koleksi-soal/koleksi-soal.component';
import { KoleksiUjianComponent } from './koleksi-ujian/koleksi-ujian.component';
import { KoreksiErrorComponent } from './koreksi-error/koreksi-error.component';
import { LoginUjianComponent } from './login-ujian/login-ujian.component';
import { LoginComponent } from './login/login.component';
import { MengajarComponent } from './mengajar/mengajar.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { ProfilComponent } from './profil/profil.component';
import { TabungSoalComponent } from './tabung-soal/tabung-soal.component';
import { UjianComponent } from './ujian/ujian.component';

const routes: Routes = [

  { path: 'dashboard', component: DashboardComponent,
    children:[
      { path: 'tabungSoal', component: TabungSoalComponent},
      { path: 'tabungSoal', component: TabungSoalComponent},
      { path: 'koleksiUjian', component: KoleksiUjianComponent },
      { path: 'daftarSoal', component: DaftarSoalComponent },
      { path: 'ujian', component: UjianComponent },
      { path: 'guru', component: InputGuruComponent},
      { path: 'siswa', component: InputSiswaComponent},
      { path: 'kelas', component: InputKelasComponent},
      { path: 'mapel', component: InputMapelComponent},
      { path: 'ngajar', component: MengajarComponent},
      { path: 'koleksiSoal', component: KoleksiSoalComponent},
      { path: 'profil', component: ProfilComponent},
      { path: 'monitoring', component: MonitoringComponent},
      { path: 'nilai', component: DaftarNilaiComponent},
      { path: 'cekError', component: KoreksiErrorComponent}
    ]
  },

  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'ujian', component: LoginUjianComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
