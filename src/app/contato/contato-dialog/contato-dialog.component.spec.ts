import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContatoDialogComponent } from './contato-dialog.component';

describe('ContatoDialogComponent', () => {
  let component: ContatoDialogComponent;
  let fixture: ComponentFixture<ContatoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContatoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContatoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
