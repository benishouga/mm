import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { firebaseConfig } from './.firebase';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const useEmulator = import.meta.env.USE_EMULATOR === 'true';
if (useEmulator) {
  db.useEmulator('localhost', 9000);
}
export { firebase };
