import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getInfo } from './firebase';

export default function SubPost(props) {
  const {uid, subUid} = useParams();
  const [subpost, setSubpost] = useState({});
  const [value, setValue] = useState(0);

  useMemo(()=>{
    getInfo(`/Posts/post_${uid}`, (posts)=>{
      let post = Object.values(posts.subposts).find(post=>{
        return post.uid === subUid;
      });
      setSubpost(post);
    });
  },[value])

  return (
    Object.values(subpost).length > 0 && 
    <article className='post'>
      <div className="post__container">
        <div className="post__image-wrapper">
          <div className="post__image-block">
          {
            subpost.images && Object.values(subpost.images)
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
            {subpost.name}
          </h2>
          <div className="post__texts">
            {
              subpost.texts && Object.values(subpost.texts)
              .sort((txt1, txt2)=>txt1.order-txt2.order)
              .map((text, index)=>{ return(
                <p key={text.uid} className={"post__text "+text.type}>
                  {text.content}
                </p>)
              })
            }
          </div>
        </div>
      </div>
    </article>
  )
}
