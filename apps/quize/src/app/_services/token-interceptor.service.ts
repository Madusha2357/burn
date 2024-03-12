import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AppState } from '../_state/app.state';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  browserName!: string;

  constructor(private store: Store) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    //token validate @TODO:

    const accessToken = this.store.selectSnapshot(AppState.accessToken);
    const deviceName = navigator.platform;
    const browserName = browserCheck(this.browserName);

    const clone = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
        Device: `Device ${deviceName}`,
        Browser: `Browser ${browserName}`,
      },
    });
    return next.handle(clone);
  }
}

function browserCheck(browserName: string): string {
  if (
    (navigator.userAgent.indexOf('Opera') ||
      navigator.userAgent.indexOf('OPR')) != -1
  ) {
    browserName = 'Opera';
  } else if (navigator.userAgent.indexOf('Edg') != -1) {
    browserName = 'Edge';
  } else if (navigator.userAgent.indexOf('Chrome') != -1) {
    browserName = 'Chrome';
  } else if (navigator.userAgent.indexOf('Safari') != -1) {
    browserName = 'Safari';
  } else if (navigator.userAgent.indexOf('Firefox') != -1) {
    browserName = 'Firefox';
  } else {
    browserName = 'Unknown';
  }

  return browserName;
}
