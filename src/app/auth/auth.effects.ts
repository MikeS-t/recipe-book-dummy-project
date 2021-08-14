import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";

import * as AuthActions from "./auth.actions";
import { User } from "./user.model";
import { AuthService } from "./auth.service";

export interface AuthResData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean,
}

const userCreationHandler = (id: string, email: string, token: string, expiresIn: string) => {
  const expirationTokenDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(id, email, token, expirationTokenDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.LogInSuccess({
    id: id,
    email: email,
    token: token,
    expirationTokenDate
  });
};

const errorHandler = (errorRes) => {
  let errorMsg = 'An unknown error occurred.';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.LogInFail({ error: errorMsg }));
  }

  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMsg = 'Email is already taken by another user.';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMsg = 'Sign Up is currently disabled.';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMsg = 'Too many unsuccessful attempts. Try again later.';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMsg = 'Incorrect email.';
      break;
    case 'INVALID_PASSWORD':
      errorMsg = 'Incorrect password.';
      break;
    case 'USER_DISABLED':
      errorMsg = 'The account you are trying to access is currently blocked.';
  }

  return of(new AuthActions.LogInFail({ error: errorMsg }));
};

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
  }

  authAutoLogin$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        id: string,
        email: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'NO_EFFECT' };
      }
      const loadedUserExpirationDate = new Date(userData._tokenExpirationDate);
      const loadedUser = new User(
        userData.id,
        userData.email,
        userData._token,
        loadedUserExpirationDate
      );

      if (loadedUser.token) {
        const tokenExpirationTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogOutTimer(tokenExpirationTime);
        return new AuthActions.LogInSuccess({
          id: loadedUser.id,
          email: loadedUser.email,
          token: loadedUser.token,
          expirationTokenDate: loadedUserExpirationDate
        });

      }

      return { type: 'NO_EFFECT' }; //Dispatching an empty action!
    })
  ));


  authLoginStart$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((logInData: AuthActions.LogInStart) => {
        return this.http.post<AuthResData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDW7gibG2XzNP7GVxocV47DRMPeGWJGC5c',
          {
            email: logInData.payload.email,
            password: logInData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(resData => {
            this.authService.setLogOutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return userCreationHandler(resData.localId, resData.email, resData.idToken, resData.expiresIn);
          }),
          catchError(errorRes => {
            return errorHandler(errorRes);
          })
        )
      }
    )
  ));


  authSuccessRedirect$ = createEffect(() => this.actions$.pipe(ofType(AuthActions.LOGIN_SUCCESS), tap(() => {
    this.router.navigate(['/recipes']);
  })),
    { dispatch: false });


  authSuccess$ = createEffect(() => this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(() => {
    localStorage.removeItem('userData');
    this.authService.clearLogOutTimer();
  })),
    { dispatch: false });



  authSignUp$ = createEffect(() => this.actions$.pipe(ofType(AuthActions.SIGNUP_START),
    switchMap((signUpData: AuthActions.SignUpStart) => {
        return this.http.post<AuthResData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDW7gibG2XzNP7GVxocV47DRMPeGWJGC5c',
          {
            email: signUpData.payload.email,
            password: signUpData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(resData => {
            this.authService.setLogOutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return userCreationHandler(resData.localId, resData.email, resData.idToken, resData.expiresIn);
          }),
          catchError(errorRes => {
            return errorHandler(errorRes);
          })
        )
      }
    )
  ));

}
