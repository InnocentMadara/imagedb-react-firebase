import React, { useMemo, useState } from 'react';
import '../Styles/About.scss';
import { getInfo } from './firebase';

export default function About() {
  const [data, setData] = useState({});
  const [value, setValue] = useState(0);


  useMemo(()=>{
    getInfo("About/", (data)=>{
      setData(data);
    })
  },[value])

  return (
    <section className='about'>
      <div className="about__container container">
        <img className='about__image' src={Object.values(data).length>0 && data.image.url} alt="" />
        <div className="about__text-block">
          <h2 className='about__title'>About</h2>
          <p className='about__text'>{Object.values(data).length>0 && data.text}</p>
        </div>
      </div>
    </section>
  )
}
