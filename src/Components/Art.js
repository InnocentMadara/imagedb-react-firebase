import React, {useState, useMemo, useEffect} from 'react'
import "../Styles/Art.scss";
import Masonry from 'react-smart-masonry';
import { useLocation, Link } from 'react-router-dom';
import Upload from './Upload/Upload';
import Hover from './Hover/Hover';
import { getPosts, getInfo } from './firebase';

export default function Art(props) {
  const [value, setValue] = useState(0);

  const location = "/Art";
  const isEdit = props.isEdit;

  useEffect(()=>{
    window.dispatchEvent(new Event("resize"));
  })

  const [posts, setPosts] = useState([]);

  useMemo(()=>{
    getInfo(location, (posts)=>{
      setPosts(Object.values(posts)
        .filter(post=>post)
        .sort((post1, post2)=>{
        return post1.order - post2.order;
      }));
    })
  },[value])
  

  return (
    <div className='art'>
      <div className="container">
        <Masonry
        className="art__item-block"
        columns={{tablet: 2, desktop: 3}}
        breakpoints={{tablet: 0, desktop: 767}} 
        gap={10}
        autoArrange={true}
        >
          {
            posts.map(((item, index)=>{
              return(
                <div key={index} className='post'>
                  <Link className="installation__item" to={`/art/${item.name}`} >
                    <img height={640} width={400} src={(Object.values(item.images).filter(image=>image).length !== 0 && Object.values(item.images).filter(image=>image)[0].url) || "#"} className="art__image"  alt="" />
                    <p className="art__title">{item.name}</p>
                  </Link>
                  {isEdit && (
                  <Hover location={location} update={()=>{setValue(value+1)}} index={index} image={item} images={posts} />)}
                </div>
              )
            }))
          }
        </Masonry>
        {isEdit && (
          <Upload type="album" location={location} callback={()=>{setValue(value+1)}} />
        )}
      </div>
    </div>
  )
}