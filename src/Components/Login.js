import React, { useRef } from 'react'
import { logOut, signIn } from './firebase';

import "../Styles/Login.scss"


export default function Login(props) {
  const user = props.currentUser;
  
  const emailElement = useRef();
  const passwordElement = useRef();

  return (
    <section className='login'>
      <div className="login__container container">
        {
        user === null?
        <>
          <input ref={emailElement} className="login__email-input login__input" placeholder='email'/>
          <input ref={passwordElement} className="login__password-input login__input" placeholder='password'/>
          <button onClick={()=>{
            signIn(
              emailElement.current.value, 
              passwordElement.current.value, 
              ()=>{alert("logged in"); 
              });
          }} className="login__signup-button login__button">Sign up</button>
        </> : 
        <>
          <button onClick={()=>{
            logOut();   
            props.onLogOut();
          }} className="login__logout-button login__button">Log out</button>
        </>
        }
      </div>
    </section>
  )
}