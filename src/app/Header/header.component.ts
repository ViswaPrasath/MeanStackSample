import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../Auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{

    private authStatusSub: Subscription;
    authStatus = false;

    constructor(private authService: AuthService) { }
    
    ngOnInit() {
        this.authStatus = this.authService.getAuth();
        this.authStatusSub = this.authService.getAuthStatus().subscribe(isAuthenticated => {
            this.authStatus = isAuthenticated;
        });
    }

    logout() {
        this.authService.logout();    
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }
}