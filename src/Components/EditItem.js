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
    
    const tx = Array.from(document.getElementsByTagName("textarea"));
    tx.forEach((textarea)=>{
      textarea.setAttribute("style", "height:" + (textarea.scrollHeight) + "px;overflow-y:hidden;");
      textarea.addEventListener("input", OnInput, false);
      textarea.style.height = 0;
      textarea.style.height = (textarea.scrollHeight) + "px";
    })

    function OnInput() {
      this.style.height = 0;
      this.style.height = (this.scrollHeight) + "px";
    }
  },[post, value])

  const imageHandler = (e, maxWidth) => {
    let file = e.target.files[0];
    if(!file) return;

    if(file.type.indexOf("image/") === -1){
      e.target.value = "";
      document.querySelector('.file-input__text').textContent = "📥 Choose an image...";
    }
    else{
      let fileName = file.name;
      if (fileName.length >= 17) fileName = fileName.substring(0, 14) + "..."
      document.querySelector('.file-input__text').textContent = "🖼️ " + fileName;
    }

    
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
      getInfo("Posts/", (posts)=>{
        let postList = Object.values(posts)
        .filter(post=>post.order!==post.uid)
        .sort((post1, post2)=>post1.order-post2.order)
        
        if(postList.length === 0){
          window.location.replace(window.location.origin + "/testing/edit")
        }
        else{
          postList.forEach((post, index)=>{
            updateOrder("Posts", `post_${post.uid}`, index+1, ()=>{
              console.log(index, postList.length-1);
              if(index===postList.length-1){
                window.location.replace(window.location.origin + "/testing/edit")
              }
            })
          })
        }
      })
    })
  }

  const setNameHandler = (e) => {
    let name = document.querySelector('.edit-post__name-input').value;
    updateInfo(`Posts/post_${post.uid}/name`, name, ()=>{
      setValue(value+1);
    })
  }

  const addTextHandler = (e) => {
    let uid = v4();
    let order = 1;

    getInfo("/", (db)=>{
      if(db.Posts[`post_${post.uid}`].texts){
        order = Object.values(db.Posts[`post_${post.uid}`].texts).length+1;
      }
      updateInfo(`Posts/post_${post.uid}/texts/text_${uid}`, {uid: uid, content: "New text", type:"text", order: order}, ()=>{
        setValue(value+1);
      })
    })
  }

  const setTypeAndSaveHandler = (e, text, type) => {
    let textarea = e.target.closest(".edit-post__text-wrapper").querySelector("textarea");
    updateInfo(`Posts/post_${post.uid}/texts/text_${text.uid}/type`, type, ()=>{
      updateInfo(`Posts/post_${post.uid}/texts/text_${text.uid}/content`, textarea.value, ()=>{
        setValue(value+1);
      })
    })
  }

  const updateTextsOrderHandler = (e, direction, text, texts) => {
    if(direction==="up"){
      updateOrder(`Posts/post_${post.uid}/texts`, `text_${texts.find(txt=>txt.order===text.order-1).uid}`, text.order,()=>{
        updateOrder(`Posts/post_${post.uid}/texts`, `text_${text.uid}`, text.order-1, ()=>{
          setValue(value+1);
        })
      })
    }
    else if(direction==="down"){
      updateOrder(`Posts/post_${post.uid}/texts`, `text_${texts.find(txt=>txt.order===text.order+1).uid}`, text.order,()=>{
        updateOrder(`Posts/post_${post.uid}/texts`, `text_${text.uid}`, text.order+1, ()=>{
          setValue(value+1);
        })
      })
    }
    else{
      console.log("error")
    }
  }

  const deleteTextHandler = (e, text) => {
    removeInfo(`Posts/post_${post.uid}/texts/text_${text.uid}`, ()=>{
      if(Object.values(post.texts).length === 1){
        setValue(value+1)
      }
      else{
        Object.values(post.texts)
        .filter(txt=>txt.uid!==text.uid)
        .sort((txt1, txt2)=>txt1.order-txt2.order)
        .forEach((txt, index)=>{
          updateOrder(`Posts/post_${post.uid}/texts`, `text_${txt.uid}`, index+1, ()=>{
            if(index===Object.values(post.texts).filter(txt=>txt.uid!==text.uid).length-1)
            setValue(value+1)
          })
        })
      }
    })
  }
  
  return (
    post &&
    <article className='edit-post'>
      <div style={{padding: "0 80px", display: "flex", columnGap: 80, justifyContent: "center"}} className="edit-post__container container">
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
          <div style={{display: "flex", flexDirection: "column", rowGap: "20px"}} className="edit-post__upload-image">
            <label className="edit-post__input-wrapper file-input">
              <p className='file-input__text'>📥 Choose an image...</p>
              <input hidden className='inputfile' type="file" onChange={e=>{imageHandler(e, 867)}} accept="image/*"/>
            </label>
            <Button variant="contained" onClick={e=>{uploadImageHandler(e)}}>Add new image</Button>
          </div>
          <Button onClick={e=>{removePostHandler(e)}} sx={{marginTop: "40px"}} variant="outlined" color="error">Remove Post</Button>
        </Stack>

        <Stack spacing={3} sx={{flex: "0 1 min(100%, 500px)"}}>
          <Stack direction="row" spacing={2} sx={{alignItems: "center"}}>
            <input style={{border: "2px solid black", borderRadius: "4px", padding: "4px"}} className='edit-post__name-input title' type="text" />
            <Button onClick={e=>{setNameHandler(e)}} variant="contained">Set new name</Button>
          </Stack>
          <Stack direction="column" spacing={2} sx={{alignItems: "normal"}}>
              {
                post.texts && 
                Object.values(post.texts)
                .sort((txt1, txt2)=>txt1.order-txt2.order)
                .map((text)=>{
                  return(
                  <Stack key={text.uid} className="edit-post__text-wrapper" direction="row" spacing={1} sx={{alignItems: "center"}}>
                    <textarea className={text.type} defaultValue={text.content}></textarea>
                    <Button onClick={(e)=>setTypeAndSaveHandler(e, text, "title")} variant='contained'>
                      <p className="title">Save</p>
                    </Button>
                    <Button onClick={(e)=>setTypeAndSaveHandler(e, text, "text")} variant='contained'>
                      <p className="text">Save</p>
                    </Button>
                    <Stack spacing={1}>
                      <Button onClick={(e)=>updateTextsOrderHandler(e, "up", text, Object.values(post.texts))} disabled={text.order===1} sx={{padding: "0", lineHeight: "1.2"}} variant="contained">▲</Button>
                      <Button onClick={(e)=>updateTextsOrderHandler(e, "down", text, Object.values(post.texts))} disabled={text.order===Object.values(post.texts).length} sx={{padding: "0", lineHeight: "1.2"}}   variant="contained">▼</Button>
                    </Stack>
                    <Button onClick={(e)=>deleteTextHandler(e, text)} variant="contained" color="error">delete</Button>
                  </Stack>)
                })
              }            
            <Button onClick={e=>{addTextHandler(e)}} variant="contained">Add new text</Button>
          </Stack>
        </Stack>
      </div>
    </article>
  )
}