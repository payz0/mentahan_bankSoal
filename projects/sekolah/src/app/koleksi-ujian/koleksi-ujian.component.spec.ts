import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoleksiUjianComponent } from './koleksi-ujian.component';

describe('KoleksiUjianComponent', () => {
  let component: KoleksiUjianComponent;
  let fixture: ComponentFixture<KoleksiUjianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KoleksiUjianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KoleksiUjianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
