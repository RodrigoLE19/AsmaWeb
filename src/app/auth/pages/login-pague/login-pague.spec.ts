import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPague } from './login-pague';

describe('LoginPague', () => {
  let component: LoginPague;
  let fixture: ComponentFixture<LoginPague>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPague],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPague);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
