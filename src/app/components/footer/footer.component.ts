import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'ffsj-web-components';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  userLogged: boolean = false;

  constructor(
    protected router: Router,
    private authService: AuthService
  ){}

  ngOnInit() {
    this.userLogged = this.authService.isLoggedIn();
    this.authService.loginStatusObservable.subscribe({
      next: (loggedIn: boolean) => {
        console.log('User logged in:', loggedIn);
        
        this.userLogged = loggedIn;
      }
    })
  }

  redirectTo(url: string) {
    this.router.navigate([url]);
  }
  
}
