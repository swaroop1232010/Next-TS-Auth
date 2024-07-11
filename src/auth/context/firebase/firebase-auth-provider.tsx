'use client';

import { useMemo, useEffect, useReducer, useCallback } from 'react';
import { doc, setDoc, collection, getFirestore } from 'firebase/firestore';
import {
  signOut,
  getAuth,
  OAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import { firebaseApp } from './lib';
import { setSession } from '../jwt/utils';
import { FirebaseAuthContext } from './firebase-auth-context';

import type { UserType, AuthState, ActionMapType } from '../../types';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const AUTH = getAuth(firebaseApp);

const DB = getFirestore(firebaseApp);

enum Types {
  INITIAL = 'INITIAL',
}

type Payload = {
  [Types.INITIAL]: {
    user: UserType;
  };
};

type Action = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthState = {
  user: null,
  loading: true,
};

const reducer = (state: AuthState, action: Action) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function FirebaseAuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(() => {
    try {
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          if (user.email) {
            const idToken = await user.getIdToken(); // Gets the Firebase ID token
            setSession(idToken);

            dispatch({
              type: Types.INITIAL,
              payload: {
                user: {
                  ...user,

                  id: user.uid,
                  role: 'admin',
                },
              },
            });
          } else {
            dispatch({
              type: Types.INITIAL,
              payload: {
                user: null,
              },
            });
          }
        } else {
          dispatch({
            type: Types.INITIAL,
            payload: {
              user: null,
            },
          });
        }
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  /*
   * (1) If skip emailVerified
   * Remove the condition (if/else) : user.emailVerified
   */
  /*
  const initialize = useCallback(() => {
    try {
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          const userProfile = doc(DB, 'users', user.uid);

          const docSnap = await getDoc(userProfile);

          const profile = docSnap.data();

          dispatch({
            type: Types.INITIAL,
            payload: {
              user: {
                ...user,
                ...profile,
                id: user.uid,
                role: 'admin',
              },
            },
          });
        } else {
          dispatch({
            type: Types.INITIAL,
            payload: {
              user: null,
            },
          });
        }
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);
*/

  useEffect(() => {
    initialize();
  }, [initialize]);

  // SIGNIN
  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(AUTH, email, password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(AUTH, provider);
  }, []);

  const signInWithGithub = useCallback(async () => {
    const provider = new GithubAuthProvider();

    await signInWithPopup(AUTH, provider);
  }, []);

  const signInWithMicrosoft = useCallback(async () => {
    const provider = new OAuthProvider('microsoft.com');
    try {
      const result = await signInWithPopup(AUTH, provider);
      // This gives you a GitHub Access Token.
      const credential = GithubAuthProvider.credentialFromResult(result);
      setSession(credential?.idToken || '');
    } catch (error) {
      // Handle Errors here.
      console.error('Error during Microsoft signIn:', error);
    }
  }, []);

  // REGISTER
  const signUp = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const newUser = await createUserWithEmailAndPassword(AUTH, email, password);

      /*
       * (1) If skip emailVerified
       * Remove : await sendEmailVerification(newUser.user);
       */
      await sendEmailVerification(newUser.user);

      const userProfile = doc(collection(DB, 'users'), newUser.user?.uid);

      await setDoc(userProfile, {
        uid: newUser.user?.uid,
        email,
        displayName: `${firstName} ${lastName}`,
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    await signOut(AUTH);
  }, []);

  // RESET PASSWORD
  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(AUTH, email);
  }, []);

  // ----------------------------------------------------------------------

  /*
   * (1) If skip emailVerified
   * const checkAuthenticated = state.user?.emailVerified ? 'authenticated' : 'unauthenticated';
   */
  const checkAuthenticated = state.user?.email ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'firebase',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      signIn,
      logout,
      signUp,
      resetPassword,
      signInWithGoogle,
      signInWithGithub,
      signInWithMicrosoft,
    }),
    [
      status,
      state.user,
      //
      signIn,
      logout,
      signUp,
      resetPassword,
      signInWithGithub,
      signInWithGoogle,
      signInWithMicrosoft,
    ]
  );

  return (
    <FirebaseAuthContext.Provider value={memoizedValue}>{children}</FirebaseAuthContext.Provider>
  );
}

// bhakta
