import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

function App() {
  const clientId = import.meta.env['VITE_GOOGLE_CLIENT_ID']

  return (
    <>
      <div className="card">
        <p>Wellcome to the login page</p>
        <p>Please choose your google account to do login</p>
        <br /><br />
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
        />
        </GoogleOAuthProvider>
      </div>
    </>
  )
}

export default App
