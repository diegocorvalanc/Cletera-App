import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommitPage } from './commit.page';

describe('CommitPage', () => {
  let component: CommitPage;
  let fixture: ComponentFixture<CommitPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
