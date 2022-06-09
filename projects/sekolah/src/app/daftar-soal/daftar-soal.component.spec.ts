import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarSoalComponent } from './daftar-soal.component';

describe('DaftarSoalComponent', () => {
  let component: DaftarSoalComponent;
  let fixture: ComponentFixture<DaftarSoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaftarSoalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarSoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
