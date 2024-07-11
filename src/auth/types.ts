import type { PopupLoginOptions, RedirectLoginOptions } from '@auth0/auth0-react';

// ----------------------------------------------------------------------

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type UserType = Record<string, any> | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

// ----------------------------------------------------------------------

type CanRemove = {
  signIn?: (email: string, password: string) => Promise<void>;
  signUp?: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  //
  signInWithGoogle?: () => Promise<void>;
  signInWithGithub?: () => Promise<void>;
  signInWithMicrosoft?: () => Promise<void>;
  //
  signInWithPopup?: (options?: PopupLoginOptions) => Promise<void>;
  signInWithRedirect?: (options?: RedirectLoginOptions) => Promise<void>;
  //
  confirmSignUp?: (email: string, code: string) => Promise<void>;
  resetPassword?: (email: string) => Promise<void>;
  resendCodeSignUp?: (email: string) => Promise<void>;
  newPassword?: (email: string, code: string, password: string) => Promise<void>;
  updatePassword?: (password: string) => Promise<void>;
};

export type AuthContextValue = CanRemove & {
  user: UserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUserSession?: () => Promise<void>;
};

export type FirebaseContextType = CanRemove & {
  user: UserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  logout: () => Promise<void>;
  checkUserSession?: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  resetPassword?: (email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
};
