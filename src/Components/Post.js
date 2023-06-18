import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getInfo } from './firebase';
import PageNotFound from './PageNotFound';

export default function Post() {
  const {title} = useParams();
  const [post, setPost] = useState({});
  const [value, setValue] = useState(0);

  useMemo(()=>{
    getInfo(`/Posts/`, (posts)=>{
      let post = Object.values(posts).find(post=>{
        return post.uid === title
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
    <article className='post'>
      <div className="post__container">
        <div className="post__image-wrapper">
          <div className="post__image-block">
          {
            post.images && Object.values(post.images)
            .sort((image1, image2)=>{
              return image1.order - image2.order;
            })
            .map((image, index)=>{
              return <img className='post__image' key={index} src={ image.url } alt="" />
            })
          }
          </div>
        </div>
        <div className="post__text-block">
          <h2 className="post__name">
            {post.name}
          </h2>
          <p className="post__description">
            {post.description}
          </p>
        </div>
      </div>
    </article>

    :

    <PageNotFound />
  )
}