import React, { useMemo, useState } from 'react';
import '../Styles/Contact.scss';
import { getInfo } from './firebase';
import { Stack } from '@mui/material';
import instagramLogo from '../Images/instagram.svg';
import openseaLogo from '../Images/opensea.svg';
import facebookLogo from '../Images/facebook.svg';
import behanceLogo from '../Images/behance.svg';


export default function Contact(props) {
  const [value, setValue] = useState(0);
  const [text, setText] = useState();
  const [links, setLinks] = useState({});

  useMemo(()=>{
    getInfo("Contact", (info)=>{
      setText(info.text);
      setLinks(info.links);
    });
  },[value])
  
  return (
    <section className='contact'>
      <div className="contact__container container">
      <div className="contact__text-block">
        <p className="contact__text">
          {
            text
          }
        </p>
        <Stack spacing={2} sx={{alignItems: "center", marginTop: "10px"}}>
          <a href={`mailto:${links.email}`} className='contact__link contact__text'>{links.email}</a>
          <Stack direction="row" spacing={2} sx={{alignItems: "center"}}>
            {links.instagram && <a href={links.instagram} className="contact__link contact__text contact__svg" target='_blank' rel="noreferrer">
              <img src={instagramLogo} alt="" />
            </a>}
            {links.opensea && <a href={links.opensea} className="contact__link contact__text contact__svg" target='_blank' rel="noreferrer">          
              <img src={openseaLogo} alt="" />
            </a>}
            {links.facebook && <a href={links.facebook} className="contact__link contact__text contact__svg" target='_blank' rel="noreferrer">          
              <img src={facebookLogo} alt="" />
            </a>}
            {links.behance && <a href={links.behance} className="contact__link contact__text contact__svg" target='_blank' rel="noreferrer">          
              <img src={behanceLogo} alt="" />
            </a>}
          </Stack>
        </Stack>
      </div>
      </div>
    </section>
  )
}
