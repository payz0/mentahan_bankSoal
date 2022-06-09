import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoleksiSoalComponent } from './koleksi-soal.component';

describe('KoleksiSoalComponent', () => {
  let component: KoleksiSoalComponent;
  let fixture: ComponentFixture<KoleksiSoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KoleksiSoalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KoleksiSoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
