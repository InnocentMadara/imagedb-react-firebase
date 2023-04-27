import React, { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { getPosts } from './firebase';
import Masonry from 'react-smart-masonry';
import Upload from './Upload/Upload';
import Hover from './Hover/Hover';
import Select from './Select/Select';

export default function Album(props) {
  const [value, setValue] = useState(0);
  const {title} = useParams();
  const [images, setImages] = useState([]);


  useEffect(()=>{
    window.dispatchEvent(new Event("resize"));
  })

  let imagesLoaded = 0;

  const location = `/Art/${title}/images`
  const isEdit = props.isEdit;

  const [selectedId, setSelectedId] = useState(0);

  useMemo(()=>{
    getPosts(location, (images)=>{
      setImages(images
        .filter(images=>images)
        .sort((image1, image2)=>{
        return image1.order - image2.order;
      }));
    })
  },[value])

  return (
    <article className='album'>
      <div className="container">
      <Select callback={()=>{setValue(value+1)}} isEdit={isEdit} location={location} selectedId={selectedId} images={images} />
      <Masonry 
          className="installation__masonry masonry"
          columns={{tablet: 2, desktop: 3}}
          breakpoints={{tablet: 0, desktop: 767}} 
          gap={10}
          autoArrange={true}
          >
        {images.map((image, index)=>{
          return(
            <div key={index} onClick={(e)=>{
                if(!e.target.closest("button")){
                setSelectedId(index);
                window.scrollTo({top:0, behavior:"smooth"})}
                }} className="masonry__item post">
              <img onLoad={()=>{
                  imagesLoaded++;
                  if(imagesLoaded <= Object.values(images).length && imagesLoaded <= 20){
                    window.dispatchEvent(new Event("resize"));
                  }
                  }} src={image.url} className='post__image' alt="" />
              {isEdit && (
                <Hover location={location} update={()=>{setValue(value+1)}} image={image} index={index} images={images}  />)}
            </div>
          )
        })}
        </Masonry>
          {
            isEdit && (
              <Upload location={location} callback={()=>{setValue(value+1)}}/>
            )
          }
      </div>
    </article>
  )
}
