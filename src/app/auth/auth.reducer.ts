import * as AuthActions from "./auth.actions"
import { User } from "./user.model";

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

export interface AppState {
  auth: State;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(
  state: State = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return { ...state, authError: null, loading: true };

    case AuthActions.LOGIN_SUCCESS:
      return {
        ...state,
        user: new User(
          action.payload.id,
          action.payload.email,
          action.payload.token,
          action.payload.expirationTokenDate
        ),
        authError: null,
        loading: false
      };

    case AuthActions.LOGIN_FAIL:
      return { ...state, user: null, authError: action.payload.error, loading: false};

    case AuthActions.LOGOUT:
      return { ...state, user: null };

    case AuthActions.CLEAR_ERROR:
      return { ...state, authError: null };

    default:
      return state;
  }
}
