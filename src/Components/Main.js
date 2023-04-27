import React, { useEffect, useMemo, useState } from 'react';
import { getPosts} from './firebase';
import Masonry from 'react-smart-masonry';
import Hover from './Hover/Hover';
import Select from './Select/Select';
import '../Styles/Main.scss';

export default function Main(props) {
  const isEdit = props.isEdit;
  const [value, setValue] = useState(0);

  useEffect(()=>{
    window.dispatchEvent(new Event("resize"));
  })

  let imagesLoaded = 0;
  
  const location = "/Main"
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(0);

  useMemo(()=>{
    getPosts(location, (images)=>{
      setImages(images
        .filter(image=>image)
        .sort((image1, image2)=>{
        return image1.order - image2.order;
      }));
    })
  },[value])
  
  return (
    <section className='main'>
      <div className="main__container container">
        <Select callback={()=>{setValue(value+1)}} description="hidden" isEdit={isEdit} location={location} selectedId={selectedId} images={images}/>
        <Masonry 
          className="main__masonry masonry"
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
                }} key={index} className="masonry__item main__post post">
                <img onLoad={()=>{
                  imagesLoaded++;
                  if(imagesLoaded <= Object.values(images).length){
                    window.dispatchEvent(new Event("resize"));
                  }
                  }} className='post__image' src={image.url} alt={`main ${image.name}`} />
                {isEdit && (
                  <Hover showDelete={false} location={location} update={()=>{setValue(value+1)}} image={image} index={index} images={images} />
                )}
              </div>
            )})
          }
        </Masonry>
      </div>
    </section>
  )
}