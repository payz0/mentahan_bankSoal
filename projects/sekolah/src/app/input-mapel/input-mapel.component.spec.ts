import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMapelComponent } from './input-mapel.component';

describe('InputMapelComponent', () => {
  let component: InputMapelComponent;
  let fixture: ComponentFixture<InputMapelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputMapelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputMapelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
