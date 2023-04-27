import React, {useMemo, useState, useEffect} from 'react';
import Select from './Select/Select';
import Hover from './Hover/Hover';
import Upload from './Upload/Upload';
import { getPosts, getInfo } from './firebase';
import Masonry from 'react-smart-masonry';

export default function AI(props) {
  const isEdit = props.isEdit;
  const [value, setValue] = useState(0);

  useEffect(()=>{
    window.dispatchEvent(new Event("resize"));
  })

  let imagesLoaded = 0;

  const location = "/Ai"
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(0);

  useMemo(()=>{
    getInfo(location, (images)=>{
      setImages(Object.values(images)
        .filter(image=>image)
        .sort((image1, image2)=>{
        return image1.order - image2.order;
      }));
    })
  },[value])
  
  return (
    <section className='ai'>
      <div className="ai__container container">
        <Select callback={()=>{setValue(value+1)}} isEdit={isEdit} location={location} selectedId={selectedId} images={images}/>
        <Masonry 
          className="ai__masonry masonry"
          columns={{tablet: 2, desktop: 3}}
          breakpoints={{tablet: 0, desktop: 767}} 
          gap={10}
          autoArrange={true}
          >
          {
            images.map((image, index)=> {
              return(
              <div onClick={(e)=>{
                if(!e.target.closest("button")){
                setSelectedId(index);
                window.scrollTo({top:0, behavior:"smooth"})}
                }} key={index} className="masonry__item ai__post post">
                <img onLoad={()=>{
                  imagesLoaded++;
                  if(imagesLoaded <= Object.values(images).length){
                    window.dispatchEvent(new Event("resize"));
                  }
                  }} className='post__image' src={image.url} alt={`ai ${image.name}`} />
                {isEdit && (
                  <Hover location={location} update={()=>{setValue(value+1)}} image={image} index={index} images={images} />
                )}
              </div>
            )})
          }
        </Masonry>
        {
          isEdit && (
            <Upload location={location} callback={()=>{setValue(value+1)}}/>
          )
        }
      </div>
    </section>
  )
}