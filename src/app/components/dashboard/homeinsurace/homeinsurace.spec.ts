import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Homeinsurace } from './homeinsurace';

describe('Homeinsurace', () => {
  let component: Homeinsurace;
  let fixture: ComponentFixture<Homeinsurace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Homeinsurace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Homeinsurace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
