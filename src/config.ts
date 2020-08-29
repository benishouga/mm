import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { firebaseConfig } from './.firebase';

firebase.initializeApp(firebaseConfig);
export { firebase };
