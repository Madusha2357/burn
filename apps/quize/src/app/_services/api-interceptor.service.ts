import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { PATH_LOGIN } from '../app-routing.conts';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const url = `${environment.url}/${req.url}`;
    const clone = req.clone({ url });
    // return next.handle(clone);
    return next.handle(clone).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e.status === 401) this.store.dispatch(new Navigate([PATH_LOGIN]));
        return throwError(() => e);
      })
    );
  }
}
