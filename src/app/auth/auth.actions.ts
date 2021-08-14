import { Action } from "@ngrx/store";

export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGIN_START = '[Auth] Login Start';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const SIGNUP_START = '[Auth] Sign Up';
export const LOGOUT = '[Auth] Logout';
export const CLEAR_ERROR = '[Auth] Clear Error';

export class AutoLogIn implements Action {
  readonly type = AUTO_LOGIN;
}

export class SignUpStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: {
    email: string;
    password: string
  }) {}
}

export class LogInStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: {
    email: string;
    password: string
  }) {}
}

export class LogInSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public payload: {
    id: string;
    email: string;
    token: string;
    expirationTokenDate: Date;
  }) {}
}

export class LogInFail implements Action {
  readonly type = LOGIN_FAIL;

  constructor(public payload: { error: string }) {}
}

export class LogOut implements Action {
  readonly type = LOGOUT;
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}


export type AuthActions =
  AutoLogIn
  | SignUpStart
  | LogInStart
  | LogInSuccess
  | LogInFail
  | LogOut
  | ClearError;
