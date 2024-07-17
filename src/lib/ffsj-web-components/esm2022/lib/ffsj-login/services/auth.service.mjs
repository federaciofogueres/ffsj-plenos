import { Injectable } from '@angular/core';
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
                    resolve(res);
                },
                error: error => {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }
    getToken() {
        let token = '';
        if (this.cookieService.get('token')) {
            token = this.encoderService.decrypt(this.cookieService.get('token'));
        }
        return token;
    }
    logout() {
        this.cookieService.delete('token');
        this.router.navigateByUrl('login');
    }
    isLoggedIn() {
        const token = this.cookieService.get('token');
        return token !== null && token !== '' ? this.checkToken() : false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZmZzai13ZWItY29tcG9uZW50cy9zcmMvbGliL2Zmc2otbG9naW4vc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQVczQyxNQUFNLE9BQU8sV0FBVztJQUd0QixZQUNVLE1BQWMsRUFDZCxZQUEwQixFQUMxQixjQUE4QixFQUM5QixhQUE0QjtRQUg1QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQ2xDLENBQUM7SUFFTCxVQUFVO1FBQ1IsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFDLENBQUE7SUFDbEcsQ0FBQztJQUVELG9CQUFvQixDQUFDLEtBQWE7UUFDaEMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUMzRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7SUFDN0QsQ0FBQztJQUVPLGFBQWE7UUFDbkIsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssV0FBVyxDQUFDO0lBQzlGLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBYTtRQUNyQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztRQUN0RCxNQUFNLE9BQU8sR0FBRztZQUNkLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLElBQUksRUFBRSxHQUFHO1lBQ1QsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLDBEQUEwRDtTQUM1RSxDQUFBO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSyxDQUFDLElBQVksRUFBRSxRQUFnQjtRQUN4QyxJQUFJLE9BQU8sR0FBWTtZQUNyQixJQUFJO1lBQ0osUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztTQUNoRCxDQUFBO1FBQ0QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDM0MsSUFBSSxFQUFFLENBQUMsR0FBa0IsRUFBRSxFQUFFO29CQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUMsQ0FBQztvQkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNkLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFO29CQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDZixDQUFDO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDO0lBRU0sUUFBUTtRQUNiLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNwQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBQztRQUN4RSxDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxVQUFVO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUMsT0FBTyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3BFLENBQUM7K0dBdkVVLFdBQVc7bUhBQVgsV0FBVyxjQUZWLE1BQU07OzRGQUVQLFdBQVc7a0JBSHZCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBDb29raWVTZXJ2aWNlIH0gZnJvbSAnbmd4LWNvb2tpZS1zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVzcG9uc2VUb2tlbiB9IGZyb20gJy4uL2V4dGVybmFsLWFwaS9yZXNwb25zZVRva2VuJztcclxuaW1wb3J0IHsgVXN1YXJpbyB9IGZyb20gJy4uL2V4dGVybmFsLWFwaS91c3VhcmlvJztcclxuaW1wb3J0IHsgQ2Vuc29TZXJ2aWNlIH0gZnJvbSAnLi9jZW5zby5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRW5jb2RlclNlcnZpY2UgfSBmcm9tICcuL2VuY29kZXIuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XHJcblxyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXHJcbiAgICBwcml2YXRlIGNlbnNvU2VydmljZTogQ2Vuc29TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBlbmNvZGVyU2VydmljZTogRW5jb2RlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGNvb2tpZVNlcnZpY2U6IENvb2tpZVNlcnZpY2VcclxuICApIHsgfVxyXG5cclxuICBjaGVja1Rva2VuKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICF0aGlzLmNoZWNrRXhwaXJlRGF0ZVRva2VuKHRoaXMuZW5jb2RlclNlcnZpY2UuZGVjcnlwdCh0aGlzLmNvb2tpZVNlcnZpY2UuZ2V0KCd0b2tlbicpISkpXHJcbiAgfVxyXG5cclxuICBjaGVja0V4cGlyZURhdGVUb2tlbih0b2tlbjogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBleHBpcnkgPSAoSlNPTi5wYXJzZShhdG9iKHRva2VuLnNwbGl0KCcuJylbMV0pKSkuZXhwO1xyXG4gICAgcmV0dXJuIChNYXRoLmZsb29yKChuZXcgRGF0ZSkuZ2V0VGltZSgpIC8gMTAwMCkpID49IGV4cGlyeTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNMb2NhbERvbWFpbigpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT09ICdsb2NhbGhvc3QnIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gJzEyNy4wLjAuMSc7XHJcbiAgfVxyXG4gIFxyXG4gIHNhdmVUb2tlbih0b2tlbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBpc0xvY2FsID0gdGhpcy5pc0xvY2FsRG9tYWluKCk7XHJcbiAgICBjb25zdCBob3N0TmFtZSA9IGlzTG9jYWwgPyB1bmRlZmluZWQgOiAnLmhvZ3VlcmFzLmVzJztcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGRvbWFpbjogaG9zdE5hbWUsXHJcbiAgICAgIHBhdGg6ICcvJyxcclxuICAgICAgc2VjdXJlOiAhaXNMb2NhbCAvLyBBc3N1bWluZyBzZWN1cmUgY29va2llcyBzaG91bGQgbm90IGJlIHNldCBmb3IgbG9jYWxob3N0XHJcbiAgICB9XHJcbiAgICB0aGlzLmNvb2tpZVNlcnZpY2Uuc2V0KCd0b2tlbicsIHRoaXMuZW5jb2RlclNlcnZpY2UuZW5jcnlwdCh0b2tlbiksIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgbG9naW4odXNlcjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSB7XHJcbiAgICBsZXQgdXN1YXJpbzogVXN1YXJpbyA9IHtcclxuICAgICAgdXNlcixcclxuICAgICAgcGFzc3dvcmQ6IHRoaXMuZW5jb2RlclNlcnZpY2UuZW5jcnlwdChwYXNzd29yZClcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMuY2Vuc29TZXJ2aWNlLmRvTG9naW4odXN1YXJpbykuc3Vic2NyaWJlKHtcclxuICAgICAgICBuZXh0OiAocmVzOiBSZXNwb25zZVRva2VuKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgdGhpcy5zYXZlVG9rZW4ocmVzLnRva2VuISk7XHJcbiAgICAgICAgICByZXNvbHZlKHJlcylcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yOiBlcnJvciA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICByZWplY3QoZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRUb2tlbigpIHtcclxuICAgIGxldCB0b2tlbiA9ICcnO1xyXG4gICAgaWYgKHRoaXMuY29va2llU2VydmljZS5nZXQoJ3Rva2VuJykpIHtcclxuICAgICAgdG9rZW4gPSB0aGlzLmVuY29kZXJTZXJ2aWNlLmRlY3J5cHQodGhpcy5jb29raWVTZXJ2aWNlLmdldCgndG9rZW4nKSEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRva2VuO1xyXG4gIH1cclxuXHJcbiAgbG9nb3V0KCkge1xyXG4gICAgdGhpcy5jb29raWVTZXJ2aWNlLmRlbGV0ZSgndG9rZW4nKTtcclxuICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwoJ2xvZ2luJyk7XHJcbiAgfVxyXG5cclxuICBpc0xvZ2dlZEluKCk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLmNvb2tpZVNlcnZpY2UuZ2V0KCd0b2tlbicpO1xyXG4gICAgcmV0dXJuIHRva2VuICE9PSBudWxsICYmIHRva2VuICE9PSAnJyA/IHRoaXMuY2hlY2tUb2tlbigpIDogZmFsc2U7XHJcbiAgfVxyXG59XHJcbiJdfQ==