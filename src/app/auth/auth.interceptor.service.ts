import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { exhaustMap, take } from "rxjs/operators";
import { select, Store } from "@ngrx/store";

import * as fromApp from "../app.reducer";
import { userSelector } from "../shared/selectors";
import { User } from "./user.model";

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  //Add the user auth token to every outgoing request
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.pipe(
      take(1),
      select(userSelector),
      exhaustMap((user:User) => {
        if(!user) {
          return next.handle(req);
        }
        let modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedReq);
      }))
  }
}
