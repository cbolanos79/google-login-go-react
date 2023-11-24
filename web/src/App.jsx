import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

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

function App() {
  const clientId = import.meta.env['VITE_GOOGLE_CLIENT_ID']
  const [login, setLogin] = useState({logged: false, errorMessage: null})  

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
              setLogin({success: true})
            }}
            onError={() => {
              console.log('Login Failed');
              setLogin({success: false, error: true, message: "Error loggin with google"})
            }}
        />
        </GoogleOAuthProvider>
      </div>
      <br /><br />
      { login.success === true && <Card content="Success!" type="success" /> }
      { login.success === false && <Card content={"Error logging!\n" + login.message} type="error" /> }
    </>
  )
}

export default App
