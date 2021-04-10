import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import firebaseALL from 'firebase';
import { firebaseConfig } from './.firebase';

firebase.initializeApp(firebaseConfig);
if (process.env.USE_EMULATOR === 'true') {
  firebaseALL.database().useEmulator('localhost', 9000);
  firebaseALL.auth().useEmulator('http://localhost:9099');
}
export { firebase };
