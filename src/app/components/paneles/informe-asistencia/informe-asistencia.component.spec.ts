import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeAsistenciaComponent } from './informe-asistencia.component';

describe('InformeAsistenciaComponent', () => {
  let component: InformeAsistenciaComponent;
  let fixture: ComponentFixture<InformeAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeAsistenciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformeAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
