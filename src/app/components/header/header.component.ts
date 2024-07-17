import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'ffsj-web-components';
// import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    NgbModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userLogged: boolean = false;
  userAdmin: boolean = false;

  constructor(
    protected router: Router,
    protected authService: AuthService,
  ) {}

  ngOnInit() {
    this.userLogged = this.authService.isLoggedIn();
    this.authService.loginStatusObservable.subscribe({
      next: (loggedIn: boolean) => {
        console.log('User logged in:', loggedIn);
        
        this.userLogged = loggedIn;
      }
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }

}
