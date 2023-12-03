import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisproductosPage } from './misproductos.page';

describe('MisproductosPage', () => {
  let component: MisproductosPage;
  let fixture: ComponentFixture<MisproductosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MisproductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
