import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { addToDB, getInfo, getPosts, removeImage, removeImageFromSt, removeInfo, updateInfo, updateOrder, uploadImage, uploadImageSt } from './firebase';
import { Button, Card, IconButton, Input, Stack, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { MuiFileInput } from 'mui-file-input';
import { v4 } from 'uuid';

export default function EditItem() {
  const {title} = useParams();
  
  const [value, setValue] = useState(0);

  const [post, setPost] = useState({});
  const [image, setImage] = useState(null);

  useMemo(()=>{
    getInfo(`/Posts`, (posts)=>{
      setPost(Object.values(posts).filter(post=>post.uid===title)[0]);
    })
  },[value])

  useEffect(()=>{
    if(Object.values(post).length > 0)
      document.querySelector('.edit-post__name-input').value = post.name;
  },[post])

  useEffect(()=>{
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
      tx[i].addEventListener("input", OnInput, false);
      tx[i].style.height = 0;
      tx[i].style.height = (tx[i].scrollHeight) + "px";
    }

    function OnInput() {
      this.style.height = 0;
      this.style.height = (this.scrollHeight) + "px";
    }
  },[])

  const imageHandler = (e, maxWidth) => {
    let file = e.target.files[0];
    if(!file) return;

    if(file.type.indexOf("image/") === -1) e.target.value = "";
    
    const image = new Image();
    image.src = window.URL.createObjectURL(file);
    
    const canvas = document.createElement("canvas");

    image.onload = () => {
      let multiplier = 1;
      
      if(image.width > maxWidth) multiplier = maxWidth/image.width;
      
      let width = Math.round(image.width * multiplier);
      let height = Math.round(image.height * multiplier);

      canvas.width = width;
      canvas.height = height;
      const context =  canvas.getContext("2d");
      createImageBitmap(file).then((imgbm)=>{
      context.drawImage(imgbm, 0, 0, width, height);
      canvas.toBlob((blob)=>{
        setImage(blob);
      }, "image/jpeg");
    });
    }

    
  }

  const uploadImageHandler = (e) => {
    if(!image) return;
    getInfo("Posts/", (posts)=>{
      const post = Object.entries(posts).find(post=>post[1].uid===title);
      let uid = v4();
      let order = 1;
      if(post[1].images) order = Object.values(post[1].images).length + 1;

      uploadImageSt("Images", image, post[0], uid, order, ()=>{setValue(value+1)});
    })
  }

  const deleteImageHandler = (e, image) => {
    removeImage(`Posts/post_${post.uid}/images/image_${image.uid}`, `Images/${image.uid}`, ()=>{
      if(Object.values(post.images).length === 1){
        setValue(value+1)
      }
      else{
        Object.values(post.images)
        .filter(img=>img.uid!==image.uid)
        .sort((img1, img2)=>img1.order-img2.order)
        .forEach((img, index)=>{
          updateOrder(`Posts/post_${post.uid}/images`, `image_${img.uid}`, index+1, ()=>{
            if(index===Object.values(post.images).filter(img=>img.uid!==image.uid).length-1)
              setValue(value+1)
          })
        })
      }
    })
  }

  const updateOrderHandler = (e, direction, image, images) => {
    if(direction==="up"){
      updateOrder(`Posts/post_${post.uid}/images`, `image_${images.find(img=>img.order===image.order-1).uid}`, image.order,()=>{
        updateOrder(`Posts/post_${post.uid}/images`, `image_${image.uid}`, image.order-1, ()=>{
          setValue(value+1);
        })
      })
    }
    else if(direction==="down"){
      updateOrder(`Posts/post_${post.uid}/images`, `image_${images.find(img=>img.order===image.order+1).uid}`, image.order,()=>{
        updateOrder(`Posts/post_${post.uid}/images`, `image_${image.uid}`, image.order+1, ()=>{
          setValue(value+1);
        })
      })
    }
    else{
      console.log("error")
    }
  }

  const removePostHandler = (e) => {
    if(post.images){
      Object.values(post.images).forEach((img, index)=>{
        removeImageFromSt(`Images/${img.uid}`);
      })
    }
    removeInfo(`Posts/post_${post.uid}`, ()=>{
      window.location.replace(window.location.origin + "/testing/edit")
    })
  }

  const setNameHandler = (e) => {
    let name = document.querySelector('.edit-post__name-input').value;
    updateInfo(`Posts/post_${post.uid}/name`, name, ()=>{
      setValue(value+1);
    })
  }

  return (
    post &&
    <article className='edit-post'>
      <div style={{padding: "0 80px", display: "flex", columnGap: 80}} className="edit-post__container container">
        <Stack>
          <div style={{width: 200, marginBottom: 40, display: "flex", flexDirection: "column", rowGap: 40}} className="edit-post__images">
          {
            post.images && 
            Object.values(post.images)
            .sort((image1, image2)=>image1.order - image2.order)
            .map((image, index)=>{return(
              <Card className="edit-post__image-block" key={index}>
                <img width="867" height="867" src={image.url} alt="" />
                <Stack spacing={1} direction="row" sx={{justifyContent: "center", marginBottom: "20px"}}>
                  <Button onClick={e=>updateOrderHandler(e, "up", image, Object.values(post.images))} disabled={image.order===1} variant="contained">↑</Button>
                  <Button onClick={e=>updateOrderHandler(e, "down", image, Object.values(post.images))} disabled={image.order===Object.values(post.images).length} variant="contained">↓</Button>
                </Stack>
                <Button color="error" onClick={(e)=>{deleteImageHandler(e, image)}} variant="contained" sx={{width: "100%"}} >Delete image</Button>
              </Card>
            )})
          }
          </div>
          <div className="edit-post__upload-image">
            <input className='inputfile' type="file" onChange={e=>{imageHandler(e, 867)}} accept="image/*"/>
            <Button variant="contained" onClick={e=>{uploadImageHandler(e)}}>Add new image</Button>
          </div>
          <Button onClick={e=>{removePostHandler(e)}} sx={{marginTop: "40px"}} variant="outlined" color="error">Remove Post</Button>
        </Stack>

        <Stack spacing={3}>
          <Stack direction="row" spacing={2} sx={{alignItems: "center"}}>
            <input style={{border: "2px solid black", borderRadius: "4px", padding: "4px"}} className='edit-post__name-input title' type="text" />
            <Button onClick={e=>{setNameHandler(e)}} variant="contained">Set new name</Button>
          </Stack>
          <Stack direction="row" spacing={2} sx={{alignItems: "center"}}>
            <textarea className='text' />
          </Stack>
        </Stack>
      </div>
    </article>
  )
}
