import {useRef, useEffect, useState} from 'react';

import {Route, Routes, Link, useLocation, Navigate} from "react-router-dom"

import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./Components/firebase"

import Main from "./Components/Main";
import About from "./Components/About";
import Contact from "./Components/Contact";

import Art from "./Components/Art";
import Installation from './Components/Installation';
import Architecture from './Components/Architecture';
import Commercial from './Components/Commercial';
import AI from './Components/AI';

import './Styles/Styles.scss';
import './Styles/Header.scss';
import './Styles/Footer.scss';
import Album from './Components/Album';
import Login from './Components/Login';

function App() {
  const [user, setUser] = useState();
  useEffect(()=>{

    onAuthStateChanged(auth, user => {
      if(user){
        setUser(user);
      }
      else{
        setUser(null);
      }
    })
  },[])
    
  const [isEdit, setIsEdit] = useState(false);

  const header = useRef(null);
  const navigation = useRef(null);

  const location = useLocation();

  let isHeaderHidden = false;

  const headerScrollTrigger = 100;

  const setActiveLink = () => {
    const links = Array.from(navigation.current.children)

    links.forEach(link => {
      link.removeAttribute("active");
    })
    
    const activeLink = links.find((link)=>{
      if(link.hasAttribute("href")){
        return link.getAttribute("href").includes(location.pathname) && location.pathname !== "/";
      }
    });

    if(activeLink){
      activeLink.setAttribute("active","");
    }
  }

  const hideHeader = () => {
    let scroll = window.pageYOffset;

    if(scroll >= headerScrollTrigger && !isHeaderHidden && window.innerWidth <= 767){
      isHeaderHidden = true;
      header.current.setAttribute("is-hidden","");
    }
    else if (scroll < headerScrollTrigger && isHeaderHidden){
      isHeaderHidden = false;
      header.current.removeAttribute("is-hidden");
    }
  }

  useEffect(()=>{
    header.current.addEventListener('click', (e) => {
      if(e.target.closest(".header__link")){
        document.body.removeAttribute("mobile-menu-active")
      }
    });

    window.addEventListener('scroll', hideHeader)
  },[])

  useEffect(()=>{
    window.scrollTo({top: 0, behavior: "smooth"});

    setActiveLink();
    window.dispatchEvent(new Event("resize"));
    setTimeout(function() {
      window.dispatchEvent(new Event("resize"));
    }, 500);
    setTimeout(function() {
      window.dispatchEvent(new Event("resize"));
    }, 1000);
  },[location])

  const toggleMenu = (e) => {
    document.body.toggleAttribute("mobile-menu-active")
  }


  return (
    <>
      <header ref={header} className="header">
        <Link to="/" className='header__logo header__link'> Alex Kutsalo </Link>
        <div onClick={(e)=>{toggleMenu(e)}} className="header__burger-button">
          <div className="header__burger-button-container">
            <div className="header__burger-button--inactive">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="hamburger-menu"><path d="M5 7h14c.6 0 1-.4 1-1s-.4-1-1-1H5c-.6 0-1 .4-1 1s.4 1 1 1zm0 6h14c.6 0 1-.4 1-1s-.4-1-1-1H5c-.6 0-1 .4-1 1s.4 1 1 1zm0 6h14c.6 0 1-.4 1-1s-.4-1-1-1H5c-.6 0-1 .4-1 1s.4 1 1 1z"></path></svg>
            </div>
            <div className="header__burger-button--active">
            <svg className="svg-icon" style={{width: "70%", height: "70%", verticalAlign: "middle", fill: "currentColor", overflow: "hidden"}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M602.512147 511.99738l402.747939-402.747939a63.999673 63.999673 0 0 0-90.509537-90.509537L512.00261 421.487843 109.254671 18.749904a63.999673 63.999673 0 0 0-90.509537 90.509537L421.493073 511.99738 18.755134 914.745319a63.999673 63.999673 0 0 0 90.509537 90.509537L512.00261 602.506917l402.747939 402.747939a63.999673 63.999673 0 0 0 90.509537-90.509537z"  /></svg>
            </div>
          </div>
        </div>
        <nav  ref={navigation} className="header__navigation">
          <Link to="/art" className="header__projects header__link">Art</Link>
          <Link to="/installation" className="header__projects header__link">Installation</Link>
          <Link to="/architecture" className="header__projects header__link">Architecture</Link>
          <Link to="/commercial" className="header__projects header__link">Commercial</Link>
          <Link to="/ai" className="header__projects header__link">AI</Link>
          <Link to="/about" className="header__about header__link">About</Link>
          <Link to="/contact" className="header__contact header__link">Contact</Link>
          <div className="header__social">
            <a className='header__link' href="https://instagram.com/alexkutsalo?igshid=YmMyMTA2M2Y=" target='_blank' rel = "noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48"><path fill="#96857b" d="M 16.5 5 C 10.16639 5 5 10.16639 5 16.5 L 5 31.5 C 5 37.832757 10.166209 43 16.5 43 L 31.5 43 C 37.832938 43 43 37.832938 43 31.5 L 43 16.5 C 43 10.166209 37.832757 5 31.5 5 L 16.5 5 z M 16.5 8 L 31.5 8 C 36.211243 8 40 11.787791 40 16.5 L 40 31.5 C 40 36.211062 36.211062 40 31.5 40 L 16.5 40 C 11.787791 40 8 36.211243 8 31.5 L 8 16.5 C 8 11.78761 11.78761 8 16.5 8 z M 34 12 C 32.895 12 32 12.895 32 14 C 32 15.105 32.895 16 34 16 C 35.105 16 36 15.105 36 14 C 36 12.895 35.105 12 34 12 z M 24 14 C 18.495178 14 14 18.495178 14 24 C 14 29.504822 18.495178 34 24 34 C 29.504822 34 34 29.504822 34 24 C 34 18.495178 29.504822 14 24 14 z M 24 17 C 27.883178 17 31 20.116822 31 24 C 31 27.883178 27.883178 31 24 31 C 20.116822 31 17 27.883178 17 24 C 17 20.116822 20.116822 17 24 17 z"/></svg>
            </a>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Main isEdit={isEdit} />} ></Route>
        <Route path='art' element={<Art isEdit={isEdit} />} />
        <Route path='art/:title' element={<Album isEdit={isEdit} />} />
        <Route path='installation' element={<Installation isEdit={isEdit} />}/>
        <Route path='architecture' element={<Architecture isEdit={isEdit} />}/>
        <Route path='commercial' element={<Commercial isEdit={isEdit} />}/>
        <Route path='ai' element={<AI isEdit={isEdit} />}/>
        <Route path="about" element={<About isEdit={isEdit} />} />
        <Route path="contact" element={<Contact isEdit={isEdit} />} />
        <Route path="login" element={<Login onLogOut={()=>{setIsEdit(false)}} currentUser={user} />} />
      </Routes>
      <footer className="footer">
        <div className="container">
          <p className="footer__text">
              © Copyright 2023 Alex Kutsalo. All rights reserved.
          </p>
          <Link style={{position: "absolute", left: "50%", bottom: 75, transform: "translateX(-50%)"}} to="/login" className="header__login header__link">
            <img src={require("./Images/signup.png")} alt="" />
          </Link>
        </div>
      </footer>
      {user && (<button className='edit-button' data-editing={isEdit}   onClick={()=>{
        if(isEdit) setIsEdit(false);
        else if(!isEdit) setIsEdit(true);
      }}>
        ✎
      </button>)}
    </>
  );
}

export default App;
