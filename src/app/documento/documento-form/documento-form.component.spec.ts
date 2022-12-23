import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentoFormComponent } from './documento-form.component';

describe('DocumentoFormComponent', () => {
  let component: DocumentoFormComponent;
  let fixture: ComponentFixture<DocumentoFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
