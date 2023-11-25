import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpTallerPage } from './sign-up-taller.page';

describe('SignUpTallerPage', () => {
  let component: SignUpTallerPage;
  let fixture: ComponentFixture<SignUpTallerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SignUpTallerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
