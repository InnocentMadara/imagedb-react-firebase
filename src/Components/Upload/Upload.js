import React, {useState, useRef, useMemo} from 'react';
import { uploadImage, getPosts, updateInfo, uploadImageMain } from '../firebase';
import styles from './Upload.module.scss';


let metadata = {};

let images = [];
export default function Upload(props) {
  const [value, setValue] = useState(0);
  const isAlbum = props.type === "album";

  const [img, setImg] = useState(null);
  const [imgName, setImgName] = useState("");

  const textInput = useRef(null);
  const textareaInput = useRef(null);
  const fileInput = useRef(null);

  const update = () => {
    props.callback();
  }

  useMemo(()=>{
    getPosts(props.location, (imgs) => {
      // setImages(Object.values(imgs));
      images = Object.values(imgs);
    })
  },[value])

  return (
    <div className={styles.mainBlock}>
    <input className={styles.textInput} ref={textInput} placeholder={!isAlbum? 'Enter post name' : 'Enter album name'} type="text"/>

    {!isAlbum &&(
    <>
    <textarea className={styles.textareaInput} ref={textareaInput} placeholder='Enter post description' type="text"/>
    <label className={`${styles.label} ${styles.button}`} htmlFor="fileInput">
        Select image
    </label>
    <span className={styles.imageName}>
    {
      (imgName || "Image not selected")
    }
    </span>
    <input className={styles.fileInput} id='fileInput' accept="image/*" ref={fileInput} onChange={(e)=>{
      // const img = new Image();
      // if(!e.target.files[0]) return;
      // img.src = window.URL.createObjectURL(e.target.files[0]);
      // img.onload = () => {
      //   metadata = {width: img.width, height: img.height};
      //   console.log(images.length, images);
      // }
      setImg(fileInput.current.files[0]);
      setImgName(fileInput.current.files[0].name);
    }} type="file" />
    </>
    )}

    <button className={styles.button} onClick={()=>{
      if(!textInput.current.value){
        alert("Choose name");
        return;
      }
      if(!isAlbum){

        if(images.filter(image=>{
        return image.name === textInput.current.value;
        }).length > 0) {
          alert("Name already taken");
          return;
        };
        if(!fileInput.current.files[0]){
          alert("Choose image");
          return;
        }

      getPosts(props.location, (imgs) => {
        images = Object.values(imgs);
        
        uploadImage(props.location, img , textInput.current.value, {order: images.length, description: textareaInput.current.value }, (url)=>{
          getPosts("Main", (imgs) => {
            uploadImageMain("Main", url , textInput.current.value, {order: imgs.length, description: textareaInput.current.value }, ()=>{
              alert(`Image "${textInput.current.value}" was uploaded`);
              update();
            })
          })
        })
      })

      }
      else{
        updateInfo(`${props.location}/${textInput.current.value}`, 
        {
          name: textInput.current.value, 
          order: images.length || 1, 
          images: {
            NotEmpty: false
          }
        }, 
        ()=>{alert(`Album "${textInput.current.value}" was uploaded`); update()})
      }
    }
    }>
      {!isAlbum? "Upload image" : "Upload album"}
    </button>
  </div>
  )
}
