import { useState, Component } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { Card } from './card.jsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const clientId = import.meta.env['VITE_GOOGLE_CLIENT_ID']
const base_url = "http://localhost:8080"

function validateCredential(credential, setLogin, setUser) {
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
    setUser(data)
    setLogin({success: true, logged: true})
  }).
  catch(error => {
    setLogin({success: false, logged: false, message: "Error connecting to backend\n" + error})
  })
}

function logout(setUser, setLogin) {
  setUser({})
  setLogin({logged: false})
}

function App() {
  const [login, setLogin] = useState({logged: false, errorMessage: null})  
  const [user, setUser] = useState({})

  return (
    <>
      <Card>
        { login.logged && (
         <>
           <div className="profile">
             <img src={user.picture_url} />{user.name}
           </div>
           <a href="#" onClick={() => logout(setUser, setLogin)}>Logout</a>
         </>
        )
        }
        { !login.logged && (
          <>
            <p>Wellcome to the login page</p>
            <p>Please choose your google account to do login</p>
            <br /><br />
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={credentialResponse => validateCredential(credentialResponse, setLogin, setUser) }
                onError={() => {
                  console.log('Login Failed');
                  setLogin({success: false, message: "Error loggin with google"})
                }}
              />
            </GoogleOAuthProvider>
          </>
        )
        }
      </Card>
      <br /><br />
      <>
        { login.success === true && <Card type="success">Success</Card> }
        { login.success === false && <Card type="error">{login.message}</Card> }
      </>
    </>
  )
}

export default App
