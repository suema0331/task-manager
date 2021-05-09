import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {catchError, switchAll, switchMap, tap} from 'rxjs/operators';
import {empty} from 'rxjs/internal/Observer';

@Injectable({
  providedIn: 'root'
})
export class WebRequestInterceptor implements HttpInterceptor{

  constructor(
    private authService: AuthService
  ) { }

  refreshingAccessToken: boolean;
  accessTokenRefreshed: Subject<any> = new Subject();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // handle the req
    req = this.addAuthHeader(req);
    // call next() and handle the response
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        if (error.status === 401){
          // 401 error so we are unauthorized
          // refresh the access token
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              req = this.addAuthHeader(req);
              return next.handle(req);
            }),
            catchError((err: any) => {
              console.log(err);
              this.authService.logout();
              // @ts-ignore
              return empty();
            })
          );
        }
        return throwError(error);
      })
    );

  }

  refreshAccessToken(){
    if (this.refreshingAccessToken){
      return new Observable(observer => {
        this.accessTokenRefreshed.subscribe(() => {
          // this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshingAccessToken = true;
      // we want to call a method in the auth service to send a req to refresh the accesstoken
      return this.authService.getNewAccessToken().pipe(
        tap(() => {
          console.log('Access Token Refreshed');
          this.refreshingAccessToken = false;
          this.accessTokenRefreshed.next();
        })
      );
    }

  }

  private addAuthHeader(req: HttpRequest<any>) {
    // get the access token
    const token = this.authService.getAccessToken();
    if (token){
      // append the access token to the request header
      return req.clone({
        setHeaders: {
          'x-access-token': token
        }
      });
    }
    return req;
  }
}
