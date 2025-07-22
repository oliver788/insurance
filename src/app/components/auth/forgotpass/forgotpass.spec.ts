import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forgotpass } from './forgotpass';

describe('Forgotpass', () => {
  let component: Forgotpass;
  let fixture: ComponentFixture<Forgotpass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Forgotpass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Forgotpass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
