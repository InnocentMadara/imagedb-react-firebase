import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getInfo } from './firebase';
import Masonry from 'react-masonry-css';
import { Link } from 'react-router-dom';
import '../Styles/Main.scss';

let postsDOM = [];

export default function Main(props) {
  const [value, setValue] = useState(0);

  useEffect(()=>{
    window.dispatchEvent(new Event("resize"));
  })

  let imagesLoaded = 0;
  
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState({});

  let masonryRef = useRef(null);
  
  let postsRef = useRef([]);
  postsRef.current = [];
  
  const addToRefs = (el) => {
    if(el && postsRef.current.filter(post=>post.href === el.href).length === 0){
      postsRef.current.push(el);
    }
  }
  
  useMemo(()=>{
    getInfo("/Posts", (posts)=>{
      setPosts(posts);
    });
  },[value])
  
  const setPostsArray = () => {
    if(!masonryRef.current) return;
    postsDOM = document.querySelectorAll(".post-preview");
  }


  useEffect(()=>{
    setTimeout(function() {
      setPostsArray();
      setParallaxStyles();
    }, 0);
  },[])
  
  const setParallaxStyles = ()=>{
    if(postsDOM.length > 0){
      postsDOM.forEach(post=>{
        let offset =(post.getBoundingClientRect().top - window.innerHeight/2)
        if(post.getBoundingClientRect().top + window.scrollY < window.innerHeight/2){
          offset = offset - (post.getBoundingClientRect().top + window.scrollY - window.innerHeight/2)
        }
        post.style.transform = `translateY(${offset / 20}%)`;
      })
    }
  }
  
  window.addEventListener("resize", setPostsArray)
  window.addEventListener("scroll", setParallaxStyles)  

  
  const postsList = Object.values(posts)
  .sort((post1, post2)=>post1.order-post2.order)
  .map((post, index)=>{
    return (
      <Link
        className="post-preview masonry__item"
        to={`/${post. uid}/${
          post.subposts ?
          Object.values(post.subposts).length > 1 ? "" : Object.values(post.subposts)[0].uid
          : ""
        }`}
        key={index}
        ref={addToRefs}
        >
        <img className="post-preview__image" src={
            post.subposts && Object.values(post.subposts).find(subpost=>subpost.order===1).images ?
            Object.values(Object.values(post.subposts).find(subpost=>subpost.order===1).images).find(img=>img.order===1).url:
            require("../Images/MissingImage.png")}
          alt={`main ${post.name}`} />
          <h2 className="post-preview__name">
            {post.name}
          </h2>
      </Link>)
  })

  return (
    <section className='main'>
      <div className="main__container container">
        <Masonry
        ref={masonryRef}
        breakpointCols={{default: 3, 769: 2, 681: 1}}
        className="main__masonry masonry"
        columnClassName="masonry__column">
          {
            postsList
          }
        </Masonry>
      </div>
    </section>
  )
}