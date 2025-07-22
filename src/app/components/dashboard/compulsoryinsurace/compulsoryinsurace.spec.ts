import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Compulsoryinsurace } from './compulsoryinsurace';

describe('Compulsoryinsurace', () => {
  let component: Compulsoryinsurace;
  let fixture: ComponentFixture<Compulsoryinsurace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Compulsoryinsurace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Compulsoryinsurace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
