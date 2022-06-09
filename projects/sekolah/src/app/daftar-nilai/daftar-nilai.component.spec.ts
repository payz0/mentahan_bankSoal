import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarNilaiComponent } from './daftar-nilai.component';

describe('DaftarNilaiComponent', () => {
  let component: DaftarNilaiComponent;
  let fixture: ComponentFixture<DaftarNilaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaftarNilaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarNilaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
