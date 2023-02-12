import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaixaFecharComponent } from './caixa-fechar.component';

describe('CaixaFecharComponent', () => {
  let component: CaixaFecharComponent;
  let fixture: ComponentFixture<CaixaFecharComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaixaFecharComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaixaFecharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
