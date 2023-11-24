import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Informa2Page } from './informa2.page';

describe('Informa2Page', () => {
  let component: Informa2Page;
  let fixture: ComponentFixture<Informa2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Informa2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
