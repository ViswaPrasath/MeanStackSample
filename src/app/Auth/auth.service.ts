import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthModel } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'user/';

@Injectable({ providedIn: "root"})
export class AuthService {

    private token: string;
    private authListener = new Subject<boolean>();
    private authStatus = false;
    private logoutTimer: any;
    userId: string;
    constructor( private http: HttpClient, private router: Router){}

    getToken() {
        return this.token;
    }

    getAuth() {
        return this.authStatus;
    }

    getAuthStatus() {
        return this.authListener.asObservable();
    }
    
    getUserId() {
        return this.userId;
    }

    signUp(email: string, password: string) {
        const user: AuthModel = { email: email, password: password };
        this.http.post( BACKEND_URL + 'signup', user)
            .subscribe(result => {
                this.router.navigate(['/']);
            }, err => {
                    this.authListener.next(false);
            });
    }

    login(email: string, password: string) {
        const user: AuthModel = { email: email, password: password };
        this.http.post<{token: string, expiresIn: number, userId: string}>( BACKEND_URL +'login', user)
            .subscribe(result => {
                const token = result.token;   
                const expiresIn = result.expiresIn;
                this.userId = result.userId;
                this.authTimeSetter(expiresIn);
                this.token = token;
                if (token) {
                    this.authStatus = true;
                }
                this.authListener.next(true);
                const now = new Date();
                const expireDate = new Date(now.getTime() + expiresIn * 1000);
                this.saveToLocalStorage(token, expireDate, this.userId);
                this.router.navigate(['/']);
            }, err => {
                    this.authListener.next(false);
        })
    }

    autoAuthCheck() {
        const authenticationDetails = this.getLocalStorage();
        if (!authenticationDetails) {
            return;
        }
        const dateFromLS = new Date(authenticationDetails.expireDate);
        const now = new Date();
        if (dateFromLS > now) {
            this.authTimeSetter((authenticationDetails.expireDate.getTime() - now.getTime()) / 1000);
            this.token = authenticationDetails.token;
            this.userId = authenticationDetails.userId;
            this.authStatus = true;
            this.authListener.next(true);
        }
    }

    authTimeSetter(duration: number) {
        this.logoutTimer = setTimeout(() => {
            this.logout();
        }, duration * 3600); 
    }

    logout() {
        this.token = null;
        this.authStatus = false;
        clearTimeout(this.logoutTimer);
        this.clearLocalStorage();
        this.authListener.next(false);
    }

    private saveToLocalStorage(token: string, expiredate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expireDate', expiredate.toISOString());
        localStorage.setItem("userId", userId);
    }

    private clearLocalStorage() {
        localStorage.removeItem('token');
        localStorage.removeItem('expireDate');
        localStorage.removeItem('userId');
    }

    private getLocalStorage() {
        const token = localStorage.getItem('token');
        const expireDate = localStorage.getItem('expireDate');
        const userId = localStorage.getItem('userId');
        if (!token || !expireDate) {
            return;
        }
        return {
            token: token,
            expireDate: new Date(expireDate),
            userId: userId
        }
    }
}