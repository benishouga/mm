import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import firebaseALL from 'firebase';
import { firebaseConfig } from './.firebase';

firebase.initializeApp(firebaseConfig);
const db: any = firebaseALL.database();
if (process.env.USE_EMULATOR === 'true') {
  db.useEmulator('localhost', 9000);
}
export { firebase };
