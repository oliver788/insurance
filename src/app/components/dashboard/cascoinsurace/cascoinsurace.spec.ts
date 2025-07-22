import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cascoinsurace } from './cascoinsurace';

describe('Cascoinsurace', () => {
  let component: Cascoinsurace;
  let fixture: ComponentFixture<Cascoinsurace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Cascoinsurace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cascoinsurace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
