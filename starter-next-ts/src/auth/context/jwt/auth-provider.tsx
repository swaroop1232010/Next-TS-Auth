'use client';

import { useMemo, useEffect, useReducer, useCallback } from 'react';
import axios, { endpoints } from 'src/utils/axios';
import { setSession, isValidToken } from './utils';
import { UserType, ActionMapType, AuthState } from '../../types';
import { AuthContext } from '../auth-context';

// Action Types
enum Types {
  INITIAL = 'INITIAL',
  SIGNIN = 'SIGNIN',
  SIGNUP = 'SIGNUP',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: UserType;
  };
  [Types.SIGNIN]: {
    user: UserType;
  };
  [Types.SIGNUP]: {
    user: UserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthState = {
  user: null,
  loading: true,
};

const reducer = (state: AuthState, action: ActionsType) => {
  switch (action.type) {
    case Types.INITIAL:
      return {
        loading: false,
        user: action.payload.user,
      };
    case Types.SIGNIN:
      return {
        ...state,
        user: action.payload.user,
      };
    case Types.SIGNUP:
      return {
        ...state,
        user: action.payload.user,
      };
    case Types.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

const STORAGE_KEY = 'accessToken';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              accessToken,
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

  useEffect(() => {
    initialize();
  }, [initialize]);

  // SIGNIN
  const signIn = useCallback(async (email: string, password: string) => {
    const data = {
      email,
      password,
    };

    const res = await axios.post(endpoints.auth.signIn, data);

    const { accessToken, user } = res.data;

    console.log('Received accessToken:', accessToken);

    setSession(accessToken);
    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: Types.SIGNIN,
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // SIGN UP
  const signUp = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const data = {
        email,
        password,
        firstName,
        lastName,
      };

      const res = await axios.post(endpoints.auth.signUp, data);

      const { accessToken, user } = res.data;

      sessionStorage.setItem(STORAGE_KEY, accessToken);

      dispatch({
        type: Types.SIGNUP,
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    sessionStorage.removeItem('userEmail');
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      signIn,
      signUp,
      logout,
    }),
    [signIn, logout, signUp, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
