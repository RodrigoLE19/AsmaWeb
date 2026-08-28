import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEvaluation } from './list-evaluation';

describe('ListEvaluation', () => {
  let component: ListEvaluation;
  let fixture: ComponentFixture<ListEvaluation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEvaluation],
    }).compileComponents();

    fixture = TestBed.createComponent(ListEvaluation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
