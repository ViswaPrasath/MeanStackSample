import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from './Error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    
    constructor(private dialogue: MatDialog){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                let message = "Something went wrong!!!";
                if (err.error.message) {
                    message = err.error.message;
                }
                this.dialogue.open(ErrorComponent, {data: {message: message}});
                return throwError(err);
            })
        )
    }
  
}