import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
// import { KatexModule } from 'ng-katex';
import {WebcamModule} from 'ngx-webcam';

import { QuillModule } from 'ngx-quill'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabungSoalComponent } from './tabung-soal/tabung-soal.component';
import { UjianComponent } from './ujian/ujian.component';
import { KoleksiUjianComponent } from './koleksi-ujian/koleksi-ujian.component';
import { DaftarSoalComponent } from './daftar-soal/daftar-soal.component';
import { InputGuruComponent } from './input-guru/input-guru.component';
import { InputSiswaComponent } from './input-siswa/input-siswa.component';
import { InputMapelComponent } from './input-mapel/input-mapel.component';
import { InputKelasComponent } from './input-kelas/input-kelas.component';
import { CariPipe } from './cari.pipe';
import { MengajarComponent } from './mengajar/mengajar.component';
import { SanitizehtmlPipe } from './sanitizehtml.pipe';
import { KoleksiSoalComponent } from './koleksi-soal/koleksi-soal.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginUjianComponent } from './login-ujian/login-ujian.component';
import { LoginComponent } from './login/login.component';
import { ProfilComponent } from './profil/profil.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { DaftarNilaiComponent } from './daftar-nilai/daftar-nilai.component';
import { KoreksiErrorComponent } from './koreksi-error/koreksi-error.component';

@NgModule({
  declarations: [
    AppComponent,
    TabungSoalComponent,
    UjianComponent,
    KoleksiUjianComponent,
    DaftarSoalComponent,
    InputGuruComponent,
    InputSiswaComponent,
    InputMapelComponent,
    InputKelasComponent,
    CariPipe,
    MengajarComponent,
    SanitizehtmlPipe,
    KoleksiSoalComponent,
    HomeComponent,
    DashboardComponent,
    LoginUjianComponent,
    LoginComponent,
    ProfilComponent,
    MonitoringComponent,
    DaftarNilaiComponent,
    KoreksiErrorComponent
  ],
  imports: [
    // KatexModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    WebcamModule,
    QuillModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
