import React, { useState, useEffect } from "react";
import './App.css';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const App: React.FC = (props: any) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          console.log(event)
          console.log(data)
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }


  return (
    <div>
      {user ? (
        <button onClick={() => Auth.signOut()}>Sign Out</button>
      ) : (
        <button onClick={() => Auth.federatedSignIn({customProvider: "AmazonFederate"})}>Signin With Midway</button>
      )}
    </div>
  );
}

export default App;
