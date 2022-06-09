import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUjianComponent } from './login-ujian.component';

describe('LoginUjianComponent', () => {
  let component: LoginUjianComponent;
  let fixture: ComponentFixture<LoginUjianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginUjianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginUjianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
