import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit , OnDestroy  {
    isLoading = false;
    private authListenerSub: Subscription;

    ngOnInit() {
        this.authListenerSub = this.authService.getAuthStatus().subscribe(isAuthenticated => {
            this.isLoading = isAuthenticated;
        });
    }

    constructor(private authService: AuthService){}
    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        this.authService.signUp(form.value.email, form.value.password);
    }

    ngOnDestroy() {
        this.authListenerSub.unsubscribe();
    }
}