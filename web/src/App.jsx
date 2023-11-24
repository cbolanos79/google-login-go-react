import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

const clientId = import.meta.env['VITE_GOOGLE_CLIENT_ID']
const base_url = "http://localhost:8080"

function Card({type, content}) {
  let class_name = "card text-white"
  if (type == "success") {
    class_name += " bg-darkgreen"
  } else if (type == "error") {
    class_name += " bg-darkred"
  }

  return (
    <div className={class_name}>
      {content}
    </div>
  )
}

function validateCredential(credential, setLogin) {
  fetch(`${base_url}/login/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({credential: credential.credential})
  }).
  then(
    response => {
      if (response.status >= 400) {
        throw "Error connecting to server - status " + response.status
      } else {
        return response.json()
      }
    },
    error => {
      throw new Error(error)
    }).
  then(data => {
    setLogin({success: true, logged: true})
  }).
  catch(error => {
    setLogin({success: false, logged: false, message: "Error connecting to backend\n" + error})
  })
}

function App() {
  const [login, setLogin] = useState({logged: false, errorMessage: null})  

  return (
    <>
      <div className="card">
        <p>Wellcome to the login page</p>
        { !login.logged && (
          <>
            <p>Please choose your google account to do login</p>
            <br /><br />
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={credentialResponse => validateCredential(credentialResponse, setLogin) }
                onError={() => {
                  console.log('Login Failed');
                  setLogin({success: false, message: "Error loggin with google"})
                }}
              />
            </GoogleOAuthProvider>
          </>
        )
        }
      </div>
      <br /><br />
      <>
        { login.success === true && <Card content="Success!" type="success" /> }
        { login.success === false && <Card content={login.message} type="error" /> }
      </>
    </>
  )
}

export default App
