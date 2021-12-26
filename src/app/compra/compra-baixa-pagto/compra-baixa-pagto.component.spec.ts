import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraBaixaPagtoComponent } from './compra-baixa-pagto.component';

describe('CompraBaixaPagtoComponent', () => {
  let component: CompraBaixaPagtoComponent;
  let fixture: ComponentFixture<CompraBaixaPagtoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraBaixaPagtoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraBaixaPagtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
