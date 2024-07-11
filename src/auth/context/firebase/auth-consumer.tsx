'use client';

import { SplashScreen } from 'src/components/loading-screen';

import { FirebaseAuthContext } from './firebase-auth-context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthConsumer({ children }: Props) {
  return (
    <FirebaseAuthContext.Consumer>
      {(auth) => (auth.loading ? <SplashScreen /> : children)}
    </FirebaseAuthContext.Consumer>
  );
}
