import { initializeApp } from 'firebase/app';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const firebaseConfig = {
  apiKey: CONFIG.firebase.apiKey,
  authDomain: CONFIG.firebase.authDomain,
  projectId: CONFIG.firebase.projectId,
  storageBucket: CONFIG.firebase.storageBucket,
  messagingSenderId: CONFIG.firebase.messagingSenderId,
  appId: CONFIG.firebase.appId,
  measurementId: CONFIG.firebase.measurementId,
};

export const firebaseApp = initializeApp(firebaseConfig);
