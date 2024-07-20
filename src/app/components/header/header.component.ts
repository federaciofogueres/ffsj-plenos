import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'ffsj-web-components';
import { Subject, takeUntil } from 'rxjs';
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
  private unsubscribe$ = new Subject<void>();

  constructor(
    protected router: Router,
    protected authService: AuthService,
  ) {}

  ngOnInit() {
    this.userLogged = this.authService.isLoggedIn();
    this.authService.loginStatusObservable.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe({
      next: (loggedIn: boolean) => {
        console.log('User logged in:', loggedIn);
        this.userLogged = loggedIn;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}