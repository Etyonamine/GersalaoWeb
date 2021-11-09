import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentoDialogComponent } from './documento-dialog.component';

describe('DocumentoDialogComponent', () => {
  let component: DocumentoDialogComponent;
  let fixture: ComponentFixture<DocumentoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
