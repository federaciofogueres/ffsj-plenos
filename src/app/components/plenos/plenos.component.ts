import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { Pleno, PlenoService, ResponsePlenos } from '../../../api';

@Component({
  selector: 'app-plenos',
  standalone: true,
  imports: [
    FfsjSpinnerComponent
  ],
  templateUrl: './plenos.component.html',
  styleUrl: './plenos.component.scss'
})
export class PlenosComponent {

  plenos: Pleno[] = [];
  loading: boolean = false;

  constructor(
    private plenosService: PlenoService,
    protected route: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.plenosService.plenoGet().subscribe({
      next: (response: ResponsePlenos) => {
        if (response.status.status === 200) {
          this.plenos = response.plenos;
        }
        console.log(response);
        this.loading = false;
      },
      error: (error: any) => {
        console.log('Error:', error);
      }
    })
  }

}
