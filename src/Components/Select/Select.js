import React, { useEffect, useRef, useState } from 'react';
import styles from './Select.module.scss';
import { getPosts, updateInfo } from '../firebase';

export default function Select(props) {
  const isEdit = props.isEdit;

  const location = props.location;
  let selectedId = props.selectedId;
  let images = props.images;
  const [index, setIndex] = useState(0);

  const buttonsTitle = useRef(null);
  const buttonsDescription = useRef(null);

  const title = useRef(null);
  const description = useRef(null);

  const editTitle = useRef(null);
  const editDescription = useRef(null);

  useEffect(()=>{
    setIndex(selectedId);
  },[selectedId])

  const selectPrev = () => {
    window.scrollTo({top:0, behavior:"smooth"})
    setIndex(index - 1);
    if(index <= 0) setIndex(0);
  }
  const selectNext = () => {
    window.scrollTo({top:0, behavior:"smooth"})
    setIndex(index + 1);
    const imagesCount = Object.values(images).length - 1;
    if(index >= imagesCount) setIndex(imagesCount);
  }

  return (  
    <div align={props.align || ""} className={styles.selected}>
      <div className={styles.imageWrapper}>
        <img src={Object.values(images).filter(image=>image).length > 0 && images.filter(image=>image)[index].url} alt="" className={styles.image} />
        <div className={styles.textBlock} >
          <div className={styles.titleBlock}>
            <h2 onDoubleClick={(e)=>{
              if(isEdit){
                editTitle.current.hidden = false;
                editTitle.current.value = title.current.innerText;
                editTitle.current.select();
                buttonsTitle.current.hidden = false;
              }
            }} ref={title} className={styles.title} >{Object.values(images).length > 0 && images[index].name}</h2>

            <input ref={editTitle} type="text" className={styles.editTitle} hidden/>
            <div ref={buttonsTitle} hidden className={styles.buttonBlock} >
              <button onClick={()=>{
                if(isEdit){
                  if(images.filter(image=>{
                  return image.name === editTitle.current.value;
                  }).length > 0) {
                    alert("Name already taken");
                    return;
                  };
                getPosts(`${location}`, (promise)=>{
                  let postData = promise.filter(item => item.name === images[index].name)[0];
                  updateInfo(`${location}/${editTitle.current.value}`, postData);
                  updateInfo(`${location}/${editTitle.current.value}/name`, editTitle.current.value);
                  updateInfo(`${location}/${images[index].name}`, null, props.callback)
                })
                  editTitle.current.hidden = true;
                  buttonsTitle.current.hidden = true;
                }
              }}>✓</button>
              <button onClick={()=>{
                editTitle.current.hidden = true;
                buttonsTitle.current.hidden = true;
              }}>✗</button>
            </div>
          </div>
          {props.description !== "hidden" && (<div className={styles.descriptionBlock}>
            <p onDoubleClick={(e)=>{
              if(isEdit){
                editDescription.current.hidden = false;
                editDescription.current.value = description.current.innerText;
                editDescription.current.select();
                buttonsDescription.current.hidden = false;
              }
            }}  ref={description} className={styles.description} >{Object.values(images).length > 0 && images[index].description}</p>

            <textarea ref={editDescription} type="text" className={styles.editDescription} hidden/>
            <div ref={buttonsDescription} hidden className={styles.buttonBlock} >
              <button onClick={()=>{
                if(isEdit){
                  updateInfo(`${location}/${images[index].name}/description`, editDescription.current.value);
                  editDescription.current.hidden = true;
                  buttonsDescription.current.hidden = true;
                }
              }}>✓</button>
              <button onClick={()=>{
                editDescription.current.hidden = true;
                buttonsDescription.current.hidden = true;
              }}>✗</button>
            </div>
          </div>)}
        </div>
      </div>
      <div className={styles.controls}>
        <button onClick={()=>{selectPrev()}} className={styles.button}>Previous</button>
        <button onClick={()=>{selectNext()}} className={styles.button}>Next</button>
      </div>
    </div>
  )
}
