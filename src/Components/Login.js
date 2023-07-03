import React, { useRef } from 'react'
import { logOut, signIn } from './firebase';

import "../Styles/Login.scss"
import { Button, Input, Stack } from '@mui/material';


export default function Login(props) {
  const user = props.currentUser;
  
  const emailElement = useRef();
  const passwordElement = useRef();

  return (
    <section className='login'>
      <div className="login__container container">
        {
        user === null?
        <Stack spacing={2} sx={{width: "min(500px, 90vw)"}}>
          <Input inputRef={emailElement} placeholder='email'/>
          <Input inputRef={passwordElement} placeholder='password'/>
          {/* <input ref={emailElement} className="login__email-input login__input" placeholder='email'/>
          <input ref={passwordElement} className="login__password-input login__input" placeholder='password'/> */}
          <Button variant="contained" onClick={()=>{
            signIn(
              emailElement.current.value, 
              passwordElement.current.value, 
              ()=>{alert("logged in"); 
              })}
          }>Sign up</Button>
        </Stack>
        : 
        <Stack spacing={2} sx={{width: "min(500px, 90vw)"}}>
          <Button variant='contained' onClick={()=>{
            logOut();   
            props.onLogOut();
          }}>Log out</Button>
        </Stack>
        }
      </div>
    </section>
  )
}