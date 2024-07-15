import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioVotacionesComponent } from './formulario-votaciones.component';

describe('FormularioVotacionesComponent', () => {
  let component: FormularioVotacionesComponent;
  let fixture: ComponentFixture<FormularioVotacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioVotacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioVotacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
