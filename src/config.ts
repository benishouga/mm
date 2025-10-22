import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { firebaseConfig } from './firebaseConfig';

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const shouldUseEmulator = import.meta.env.VITE_USE_EMULATOR === 'true';
if (shouldUseEmulator) {
  db.useEmulator('localhost', 9000);
}
export { firebase };
