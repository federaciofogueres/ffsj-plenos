import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  @Output() scannerEnabled = new EventEmitter<{type: string, mode: boolean}>();

  constructor(
    protected router: Router
  ){}

  redirectTo(url: string) {
    this.router.navigate([url]);
  }
  
}
