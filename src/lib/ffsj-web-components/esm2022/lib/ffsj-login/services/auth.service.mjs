import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "./censo.service";
import * as i3 from "./encoder.service";
import * as i4 from "ngx-cookie-service";
export class AuthService {
    constructor(router, censoService, encoderService, cookieService) {
        this.router = router;
        this.censoService = censoService;
        this.encoderService = encoderService;
        this.cookieService = cookieService;
        this.loginStatus$ = new BehaviorSubject(false);
        this.loginStatusObservable = this.loginStatus$.asObservable();
    }
    checkToken() {
        return !this.checkExpireDateToken(this.encoderService.decrypt(this.cookieService.get('token')));
    }
    checkExpireDateToken(token) {
        const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
        return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }
    isLocalDomain() {
        return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    }
    saveToken(token) {
        const isLocal = this.isLocalDomain();
        const hostName = isLocal ? undefined : '.hogueras.es';
        const options = {
            domain: hostName,
            path: '/',
            secure: !isLocal // Assuming secure cookies should not be set for localhost
        };
        this.cookieService.set('token', this.encoderService.encrypt(token), options);
    }
    async login(user, password) {
        let usuario = {
            user,
            password: this.encoderService.encrypt(password)
        };
        return new Promise(async (resolve, reject) => {
            this.censoService.doLogin(usuario).subscribe({
                next: (res) => {
                    console.log(res);
                    this.saveToken(res.token);
                    this.loginStatus$.next(true);
                    resolve(res);
                },
                error: error => {
                    console.log(error);
                    this.loginStatus$.next(false);
                    reject(error);
                }
            });
        });
    }
    getToken() {
        let token = '';
        if (this.cookieService.get('token')) {
            token = this.encoderService.decrypt(this.cookieService.get('token'));
            this.loginStatus$.next(true);
        }
        return token;
    }
    logout() {
        this.cookieService.delete('token');
        this.router.navigateByUrl('login');
        this.loginStatus$.next(false);
    }
    isLoggedIn() {
        const token = this.cookieService.get('token');
        const isLoggedIn = token !== null && token !== '' ? this.checkToken() : false;
        this.loginStatus$.next(isLoggedIn);
        return isLoggedIn;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: AuthService, deps: [{ token: i1.Router }, { token: i2.CensoService }, { token: i3.EncoderService }, { token: i4.CookieService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: AuthService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: AuthService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.Router }, { type: i2.CensoService }, { type: i3.EncoderService }, { type: i4.CookieService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZmZzai13ZWItY29tcG9uZW50cy9zcmMvbGliL2Zmc2otbG9naW4vc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7Ozs7O0FBU3ZDLE1BQU0sT0FBTyxXQUFXO0lBS3RCLFlBQ1UsTUFBYyxFQUNkLFlBQTBCLEVBQzFCLGNBQThCLEVBQzlCLGFBQTRCO1FBSDVCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFQOUIsaUJBQVksR0FBRyxJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztRQUMzRCwwQkFBcUIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBT3JELENBQUM7SUFFTCxVQUFVO1FBQ1IsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFDLENBQUE7SUFDbEcsQ0FBQztJQUVELG9CQUFvQixDQUFDLEtBQWE7UUFDaEMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUMzRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7SUFDN0QsQ0FBQztJQUVPLGFBQWE7UUFDbkIsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssV0FBVyxDQUFDO0lBQzlGLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBYTtRQUNyQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztRQUN0RCxNQUFNLE9BQU8sR0FBRztZQUNkLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLElBQUksRUFBRSxHQUFHO1lBQ1QsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLDBEQUEwRDtTQUM1RSxDQUFBO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSyxDQUFDLElBQVksRUFBRSxRQUFnQjtRQUN4QyxJQUFJLE9BQU8sR0FBWTtZQUNyQixJQUFJO1lBQ0osUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztTQUNoRCxDQUFBO1FBQ0QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDM0MsSUFBSSxFQUFFLENBQUMsR0FBa0IsRUFBRSxFQUFFO29CQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDZCxDQUFDO2dCQUNELEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRTtvQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNuQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDOUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNmLENBQUM7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFFTSxRQUFRO1FBQ2IsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ3BDLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFDO1lBQ3RFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELFVBQVU7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QyxNQUFNLFVBQVUsR0FBRyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzlFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7K0dBL0VVLFdBQVc7bUhBQVgsV0FBVyxjQUZWLE1BQU07OzRGQUVQLFdBQVc7a0JBSHZCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBDb29raWVTZXJ2aWNlIH0gZnJvbSAnbmd4LWNvb2tpZS1zZXJ2aWNlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFJlc3BvbnNlVG9rZW4gfSBmcm9tICcuLi9leHRlcm5hbC1hcGkvcmVzcG9uc2VUb2tlbic7XHJcbmltcG9ydCB7IFVzdWFyaW8gfSBmcm9tICcuLi9leHRlcm5hbC1hcGkvdXN1YXJpbyc7XHJcbmltcG9ydCB7IENlbnNvU2VydmljZSB9IGZyb20gJy4vY2Vuc28uc2VydmljZSc7XHJcbmltcG9ydCB7IEVuY29kZXJTZXJ2aWNlIH0gZnJvbSAnLi9lbmNvZGVyLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xyXG5cclxuICBwcml2YXRlIGxvZ2luU3RhdHVzJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xyXG4gIGxvZ2luU3RhdHVzT2JzZXJ2YWJsZSA9IHRoaXMubG9naW5TdGF0dXMkLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXHJcbiAgICBwcml2YXRlIGNlbnNvU2VydmljZTogQ2Vuc29TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBlbmNvZGVyU2VydmljZTogRW5jb2RlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGNvb2tpZVNlcnZpY2U6IENvb2tpZVNlcnZpY2VcclxuICApIHsgfVxyXG5cclxuICBjaGVja1Rva2VuKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICF0aGlzLmNoZWNrRXhwaXJlRGF0ZVRva2VuKHRoaXMuZW5jb2RlclNlcnZpY2UuZGVjcnlwdCh0aGlzLmNvb2tpZVNlcnZpY2UuZ2V0KCd0b2tlbicpISkpXHJcbiAgfVxyXG5cclxuICBjaGVja0V4cGlyZURhdGVUb2tlbih0b2tlbjogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBleHBpcnkgPSAoSlNPTi5wYXJzZShhdG9iKHRva2VuLnNwbGl0KCcuJylbMV0pKSkuZXhwO1xyXG4gICAgcmV0dXJuIChNYXRoLmZsb29yKChuZXcgRGF0ZSkuZ2V0VGltZSgpIC8gMTAwMCkpID49IGV4cGlyeTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNMb2NhbERvbWFpbigpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT09ICdsb2NhbGhvc3QnIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gJzEyNy4wLjAuMSc7XHJcbiAgfVxyXG4gIFxyXG4gIHNhdmVUb2tlbih0b2tlbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBpc0xvY2FsID0gdGhpcy5pc0xvY2FsRG9tYWluKCk7XHJcbiAgICBjb25zdCBob3N0TmFtZSA9IGlzTG9jYWwgPyB1bmRlZmluZWQgOiAnLmhvZ3VlcmFzLmVzJztcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGRvbWFpbjogaG9zdE5hbWUsXHJcbiAgICAgIHBhdGg6ICcvJyxcclxuICAgICAgc2VjdXJlOiAhaXNMb2NhbCAvLyBBc3N1bWluZyBzZWN1cmUgY29va2llcyBzaG91bGQgbm90IGJlIHNldCBmb3IgbG9jYWxob3N0XHJcbiAgICB9XHJcbiAgICB0aGlzLmNvb2tpZVNlcnZpY2Uuc2V0KCd0b2tlbicsIHRoaXMuZW5jb2RlclNlcnZpY2UuZW5jcnlwdCh0b2tlbiksIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgbG9naW4odXNlcjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSB7XHJcbiAgICBsZXQgdXN1YXJpbzogVXN1YXJpbyA9IHtcclxuICAgICAgdXNlcixcclxuICAgICAgcGFzc3dvcmQ6IHRoaXMuZW5jb2RlclNlcnZpY2UuZW5jcnlwdChwYXNzd29yZClcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMuY2Vuc29TZXJ2aWNlLmRvTG9naW4odXN1YXJpbykuc3Vic2NyaWJlKHtcclxuICAgICAgICBuZXh0OiAocmVzOiBSZXNwb25zZVRva2VuKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgdGhpcy5zYXZlVG9rZW4ocmVzLnRva2VuISk7XHJcbiAgICAgICAgICB0aGlzLmxvZ2luU3RhdHVzJC5uZXh0KHRydWUpO1xyXG4gICAgICAgICAgcmVzb2x2ZShyZXMpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvcjogZXJyb3IgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgdGhpcy5sb2dpblN0YXR1cyQubmV4dChmYWxzZSk7XHJcbiAgICAgICAgICByZWplY3QoZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRUb2tlbigpIHtcclxuICAgIGxldCB0b2tlbiA9ICcnO1xyXG4gICAgaWYgKHRoaXMuY29va2llU2VydmljZS5nZXQoJ3Rva2VuJykpIHtcclxuICAgICAgdG9rZW4gPSB0aGlzLmVuY29kZXJTZXJ2aWNlLmRlY3J5cHQodGhpcy5jb29raWVTZXJ2aWNlLmdldCgndG9rZW4nKSEpO1xyXG4gICAgICB0aGlzLmxvZ2luU3RhdHVzJC5uZXh0KHRydWUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRva2VuO1xyXG4gIH1cclxuXHJcbiAgbG9nb3V0KCkge1xyXG4gICAgdGhpcy5jb29raWVTZXJ2aWNlLmRlbGV0ZSgndG9rZW4nKTtcclxuICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwoJ2xvZ2luJyk7XHJcbiAgICB0aGlzLmxvZ2luU3RhdHVzJC5uZXh0KGZhbHNlKTtcclxuICB9XHJcblxyXG4gIGlzTG9nZ2VkSW4oKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMuY29va2llU2VydmljZS5nZXQoJ3Rva2VuJyk7XHJcbiAgICBjb25zdCBpc0xvZ2dlZEluID0gdG9rZW4gIT09IG51bGwgJiYgdG9rZW4gIT09ICcnID8gdGhpcy5jaGVja1Rva2VuKCkgOiBmYWxzZTtcclxuICAgIHRoaXMubG9naW5TdGF0dXMkLm5leHQoaXNMb2dnZWRJbik7XHJcbiAgICByZXR1cm4gaXNMb2dnZWRJbjtcclxuICB9XHJcbn1cclxuIl19