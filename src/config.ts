import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { firebaseConfig } from './.firebase';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
if (process.env.USE_EMULATOR === 'true') {
  db.useEmulator('localhost', 9000);
}
export { firebase };
