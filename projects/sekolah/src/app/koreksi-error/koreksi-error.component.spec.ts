import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoreksiErrorComponent } from './koreksi-error.component';

describe('KoreksiErrorComponent', () => {
  let component: KoreksiErrorComponent;
  let fixture: ComponentFixture<KoreksiErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KoreksiErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KoreksiErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
