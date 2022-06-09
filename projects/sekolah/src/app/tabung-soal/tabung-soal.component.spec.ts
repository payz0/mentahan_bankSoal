import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabungSoalComponent } from './tabung-soal.component';

describe('TabungSoalComponent', () => {
  let component: TabungSoalComponent;
  let fixture: ComponentFixture<TabungSoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabungSoalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabungSoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
