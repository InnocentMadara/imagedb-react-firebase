import React from 'react';
import '../Styles/About.scss';

export default function About() {
  return (
    <section className='about'>
      <div className="about__container container">
        <img className='about__image' src={require("../Images/photo.jpg")} alt="" />
        <div className="about__text-block">
          <h2 className='about__title'>About</h2>
          <p className='about__text'>Sharon Pannen (born 1997, the Netherlands) is a photographer, director and creative. Sharon is based in Lisbon, Paris and Amsterdam. She works internationally and is available to travel Worldwide. 
  She is available to shoot physically or remotely, as well as managing productions including casting, graphic design, scouting, art- and creative direction. </p>
        </div>
      </div>
    </section>
  )
}
