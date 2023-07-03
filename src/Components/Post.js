import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getInfo } from './firebase';
import PageNotFound from './PageNotFound';
import Masonry from 'react-masonry-css';

export default function Post() {
  const {uid} = useParams();
  const [post, setPost] = useState({});
  const [value, setValue] = useState(0);

  useMemo(()=>{
    getInfo(`/Posts/`, (posts)=>{
      let post = Object.values(posts).find(post=>{
        return post.uid === uid
      });
      setPost(post);
    });
  },[value])

  return (
    post
    ?

    Object.keys(post).length === 0
    ?
    <></>
    :
    <div className="post">
      <div className="post__container">
        <Masonry
          breakpointCols={{default: 3, 769: 2, 681: 1}}
          className="main__masonry masonry"
          columnClassName="masonry__column">
          {
            post.subposts && Object.values(post.subposts)
            .sort((post1,post2)=>post1.order-post2.order)
            .map(subpost=>{
            return (
              <Link
                className="post-preview masonry__item"
                to={`${subpost.uid}`}
                key={subpost.uid}
                >
                <img className="post-preview__image" src={
                  subpost.images?
                  Object.values(subpost.images).find(img=>img.order===1).url
                  : require("../Images/MissingImage.png")
                } alt=""/>
                <h2 className="post-preview__name">
                  {subpost.name}
                </h2>
              </Link>
            )}) 
          }
        </Masonry>
      </div>
    </div>
    :

    <PageNotFound />
  )
}
