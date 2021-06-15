import './App.css';

import { Route, Redirect, Switch } from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import SignIn from './SignIn'
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAXxuq6xTemrSpZ9Q1_EHlOA1Axf4joUSo",
  authDomain: "chat-application-37557.firebaseapp.com",
  projectId: "chat-application-37557",
  storageBucket: "chat-application-37557.appspot.com",
  messagingSenderId: "448401421505",
  appId: "1:448401421505:web:e2d9d9826b35dd1c365040"
})
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  return (
    <Switch>
        <Redirect exact from="/" to="/login" />
        <Route path="/login" component={SignIn} />
        {/* <Route path="/chat" component={} /> */}
      </Switch>
  );
}

export default App;
