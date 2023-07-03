import {useRef, useEffect, useState} from 'react';

import {Route, Routes, Link, useLocation} from "react-router-dom"

import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./Components/firebase"

import Main from "./Components/Main";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Edit from "./Components/Edit";
import PageNotFound from "./Components/PageNotFound"

import './Styles/Styles.scss';
import './Styles/Header.scss';
import './Styles/Footer.scss';
import Login from './Components/Login';
import Post from './Components/Post';
import EditItem from './Components/EditItem';
import SubPost from './Components/SubPost';
import EditPost from './Components/EditPost';

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

  useEffect(()=>{
    if(user && !isEdit){
      setIsEdit(true)
    }
    else{
      setIsEdit(false);
    }
  },[user]);

  const header = useRef(null);
  const navigation = useRef(null);

  const location = useLocation();

  let isHeaderHidden = false;

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

  let prevScroll = 0;
  const hideHeader = () => {
    let scroll = window.pageYOffset;
    
    if(scroll > prevScroll && !isHeaderHidden){
      isHeaderHidden = true;
      header.current.setAttribute("is-hidden","");
    }
    else if (scroll < prevScroll && isHeaderHidden){
      isHeaderHidden = false;
      header.current.removeAttribute("is-hidden");
    }
    prevScroll = scroll;
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
          {
            user && <Link to="/edit" className="header__edit header__link">edit</Link> 
          }
          <Link to="/" className="header__projects header__link">Projects</Link>
          <Link to="/about" className="header__about header__link">About</Link>
          <Link to="/contact" className="header__contact header__link">Contact</Link>
        </nav>
        
      </header>
      <Routes>
        <Route path="/" element={<Main isEdit={isEdit} />} ></Route>
        <Route path="/:uid" element={<Post isEdit={isEdit} />} ></Route>
        <Route path="/:uid/:subUid" element={<SubPost isEdit={isEdit} />} />
        {
          user && <Route path="edit" element={<Edit isEdit={isEdit} />} ></Route>
        }
        {
          user && <Route path="edit/:uid" element={<EditPost isEdit={isEdit} />} ></Route>
        }
        {
          user && <Route path="edit/:uid/:subUid" element={<EditItem isEdit={isEdit} />} ></Route>
        }
        <Route path="about" element={<About isEdit={isEdit} />} />
        <Route path="contact" element={<Contact isEdit={isEdit} />} />
        <Route path="login" element={<Login onLogOut={()=>{setIsEdit(false)}} currentUser={user} />} />
        <Route path="*" element={<PageNotFound /> } />
      </Routes>
      <footer className="footer">
        <div className="container">
          <p className="footer__text">
              © Copyright 2023 Alex Kutsalo. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
