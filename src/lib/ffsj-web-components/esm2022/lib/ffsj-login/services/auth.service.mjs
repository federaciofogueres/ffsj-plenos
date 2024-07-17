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
    saveToken(token) {
        const options = {
            domain: '.hogueras.es',
            path: '/',
            secure: true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZmZzai13ZWItY29tcG9uZW50cy9zcmMvbGliL2Zmc2otbG9naW4vc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQVczQyxNQUFNLE9BQU8sV0FBVztJQUd0QixZQUNVLE1BQWMsRUFDZCxZQUEwQixFQUMxQixjQUE4QixFQUM5QixhQUE0QjtRQUg1QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQ2xDLENBQUM7SUFFTCxVQUFVO1FBQ1IsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFDLENBQUE7SUFDbEcsQ0FBQztJQUVELG9CQUFvQixDQUFDLEtBQWE7UUFDaEMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUMzRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7SUFDN0QsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFhO1FBQ3JCLE1BQU0sT0FBTyxHQUFHO1lBQ2QsTUFBTSxFQUFFLGNBQWM7WUFDdEIsSUFBSSxFQUFFLEdBQUc7WUFDVCxNQUFNLEVBQUUsSUFBSTtTQUNiLENBQUE7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBWSxFQUFFLFFBQWdCO1FBQ3hDLElBQUksT0FBTyxHQUFZO1lBQ3JCLElBQUk7WUFDSixRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1NBQ2hELENBQUE7UUFDRCxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDM0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUMzQyxJQUFJLEVBQUUsQ0FBQyxHQUFrQixFQUFFLEVBQUU7b0JBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQU0sQ0FBQyxDQUFDO29CQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ2QsQ0FBQztnQkFDRCxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUU7b0JBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNmLENBQUM7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFFTSxRQUFRO1FBQ2IsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ3BDLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFDO1FBQ3hFLENBQUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELFVBQVU7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QyxPQUFPLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDcEUsQ0FBQzsrR0FqRVUsV0FBVzttSEFBWCxXQUFXLGNBRlYsTUFBTTs7NEZBRVAsV0FBVztrQkFIdkIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IENvb2tpZVNlcnZpY2UgfSBmcm9tICduZ3gtY29va2llLXNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZXNwb25zZVRva2VuIH0gZnJvbSAnLi4vZXh0ZXJuYWwtYXBpL3Jlc3BvbnNlVG9rZW4nO1xyXG5pbXBvcnQgeyBVc3VhcmlvIH0gZnJvbSAnLi4vZXh0ZXJuYWwtYXBpL3VzdWFyaW8nO1xyXG5pbXBvcnQgeyBDZW5zb1NlcnZpY2UgfSBmcm9tICcuL2NlbnNvLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFbmNvZGVyU2VydmljZSB9IGZyb20gJy4vZW5jb2Rlci5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcclxuICAgIHByaXZhdGUgY2Vuc29TZXJ2aWNlOiBDZW5zb1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIGVuY29kZXJTZXJ2aWNlOiBFbmNvZGVyU2VydmljZSxcclxuICAgIHByaXZhdGUgY29va2llU2VydmljZTogQ29va2llU2VydmljZVxyXG4gICkgeyB9XHJcblxyXG4gIGNoZWNrVG9rZW4oKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gIXRoaXMuY2hlY2tFeHBpcmVEYXRlVG9rZW4odGhpcy5lbmNvZGVyU2VydmljZS5kZWNyeXB0KHRoaXMuY29va2llU2VydmljZS5nZXQoJ3Rva2VuJykhKSlcclxuICB9XHJcblxyXG4gIGNoZWNrRXhwaXJlRGF0ZVRva2VuKHRva2VuOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGV4cGlyeSA9IChKU09OLnBhcnNlKGF0b2IodG9rZW4uc3BsaXQoJy4nKVsxXSkpKS5leHA7XHJcbiAgICByZXR1cm4gKE1hdGguZmxvb3IoKG5ldyBEYXRlKS5nZXRUaW1lKCkgLyAxMDAwKSkgPj0gZXhwaXJ5O1xyXG4gIH1cclxuXHJcbiAgc2F2ZVRva2VuKHRva2VuOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGRvbWFpbjogJy5ob2d1ZXJhcy5lcycsXHJcbiAgICAgIHBhdGg6ICcvJyxcclxuICAgICAgc2VjdXJlOiB0cnVlXHJcbiAgICB9XHJcbiAgICB0aGlzLmNvb2tpZVNlcnZpY2Uuc2V0KCd0b2tlbicsIHRoaXMuZW5jb2RlclNlcnZpY2UuZW5jcnlwdCh0b2tlbiksIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgbG9naW4odXNlcjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSB7XHJcbiAgICBsZXQgdXN1YXJpbzogVXN1YXJpbyA9IHtcclxuICAgICAgdXNlcixcclxuICAgICAgcGFzc3dvcmQ6IHRoaXMuZW5jb2RlclNlcnZpY2UuZW5jcnlwdChwYXNzd29yZClcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMuY2Vuc29TZXJ2aWNlLmRvTG9naW4odXN1YXJpbykuc3Vic2NyaWJlKHtcclxuICAgICAgICBuZXh0OiAocmVzOiBSZXNwb25zZVRva2VuKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgdGhpcy5zYXZlVG9rZW4ocmVzLnRva2VuISk7XHJcbiAgICAgICAgICByZXNvbHZlKHJlcylcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yOiBlcnJvciA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICByZWplY3QoZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRUb2tlbigpIHtcclxuICAgIGxldCB0b2tlbiA9ICcnO1xyXG4gICAgaWYgKHRoaXMuY29va2llU2VydmljZS5nZXQoJ3Rva2VuJykpIHtcclxuICAgICAgdG9rZW4gPSB0aGlzLmVuY29kZXJTZXJ2aWNlLmRlY3J5cHQodGhpcy5jb29raWVTZXJ2aWNlLmdldCgndG9rZW4nKSEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRva2VuO1xyXG4gIH1cclxuXHJcbiAgbG9nb3V0KCkge1xyXG4gICAgdGhpcy5jb29raWVTZXJ2aWNlLmRlbGV0ZSgndG9rZW4nKTtcclxuICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwoJ2xvZ2luJyk7XHJcbiAgfVxyXG5cclxuICBpc0xvZ2dlZEluKCk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLmNvb2tpZVNlcnZpY2UuZ2V0KCd0b2tlbicpO1xyXG4gICAgcmV0dXJuIHRva2VuICE9PSBudWxsICYmIHRva2VuICE9PSAnJyA/IHRoaXMuY2hlY2tUb2tlbigpIDogZmFsc2U7XHJcbiAgfVxyXG59XHJcbiJdfQ==