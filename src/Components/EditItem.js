import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getInfo, removeImage, removeImageFromSt, removeInfo, updateInfo, updateOrder, uploadImage, uploadImageSt } from './firebase';
import { Button, Card, Stack } from '@mui/material';
import { v4 } from 'uuid';

export default function EditItem() {
  const {uid: postUid, subUid} = useParams();
  
  const [value, setValue] = useState(0);

  const [post, setPost] = useState({});
  const [subpost, setSubpost] = useState({});
  const [image, setImage] = useState(null);

  useMemo(()=>{
    getInfo(`/Posts`, (posts)=>{
      let thisPost = Object.values(posts).filter(post=>post.uid===postUid)[0];
      setPost(thisPost);
      setSubpost(Object.values(thisPost.subposts).find(subpost=>subpost.uid===subUid));
    })
  },[value])
  
  useEffect(()=>{
    if(Object.values(subpost).length > 0)
    document.querySelector('.edit-post__name-input').value = subpost.name;
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
    getInfo(`Posts/post_${postUid}/subposts`, (posts)=>{
      const post = Object.entries(posts).find(post=>post[1].uid===subUid);
      let uidGenerated = v4();
      let order = 1;
      if(post[1].images) order = Object.values(post[1].images).length + 1;

      uploadImageSt("Images", image, postUid,subUid, uidGenerated, order, ()=>{setValue(value+1)});
    })
  }

  const deleteImageHandler = (e, image) => {
    console.log(image);
    removeImage(`Posts/post_${post.uid}/subposts/subpost_${subUid}/images/image_${image.uid}`, `Images/${image.uid}`, ()=>{
      if(Object.values(subpost.images).length === 1){
        setValue(value+1)
      }
      else{
        Object.values(subpost.images)
        .filter(img=>img.uid!==image.uid)
        .sort((img1, img2)=>img1.order-img2.order)
        .forEach((img, index)=>{
          updateOrder(`Posts/post_${post.uid}/subposts/subpost_${subUid}/images`, `image_${img.uid}`, index+1, ()=>{
            if(index===Object.values(subpost.images).filter(img=>img.uid!==image.uid).length-1)
              setValue(value+1)
          })
        })
      }
    })
  }

  const updateOrderHandler = (e, direction, image, images) => {
    if(direction==="up"){
      updateOrder(`Posts/post_${post.uid}/subposts/subpost_${subUid}/images`, `image_${images.find(img=>img.order===image.order-1).uid}`, image.order,()=>{
        updateOrder(`Posts/post_${post.uid}/subposts/subpost_${subUid}/images`, `image_${image.uid}`, image.order-1, ()=>{
          setValue(value+1);
        })
      })
    }
    else if(direction==="down"){
      updateOrder(`Posts/post_${post.uid}/subposts/subpost_${subUid}/images`, `image_${images.find(img=>img.order===image.order+1).uid}`, image.order,()=>{
        updateOrder(`Posts/post_${post.uid}/subposts/subpost_${subUid}/images`, `image_${image.uid}`, image.order+1, ()=>{
          setValue(value+1);
        })
      })
    }
    else{
      console.log("error")
    }
  }

  const removeSubpostHandler = (e) => {
    if(subpost.images){
      Object.values(subpost.images).forEach((img, index)=>{
        removeImageFromSt(`Images/${img.uid}`);
      })
    }
    removeInfo(`Posts/post_${post.uid}/subposts/subpost_${subUid}`, ()=>{
      getInfo(`Posts/post_${post.uid}/`, (post)=>{
        let posts = post.subposts || {};

        let subpostList = Object.values(posts)
        .filter(post=>post.uid!==subUid)
        .sort((post1, post2)=>post1.order-post2.order)

        if(subpostList.length === 0){
          window.location.replace(window.location.origin + `/#/edit/${postUid}`)
        }
        else{
          subpostList.forEach((subpost, index)=>{
            updateOrder("Posts", `post_${postUid}/subposts/subpost_${subpost.uid}`, index+1, ()=>{
              if(index===subpostList.length-1){
                window.location.replace(window.location.origin + `/#/edit/${postUid}`)
              }
            })
          })
        }
      })
    })
  }

  const setNameHandler = (e) => {
    let name = document.querySelector('.edit-post__name-input').value;
    updateInfo(`Posts/post_${post.uid}/subposts/subpost_${subUid}/name`, name, ()=>{
      setValue(value+1);
    })
  }

  const addTextHandler = (e) => {
    let uid = v4();
    let order = 1;

    getInfo(`/Posts/post_${postUid}/subposts/subpost_${subUid}`, (db)=>{
      if(db.texts){
        order = Object.values(db.texts).length+1;
      }
      updateInfo(`Posts/post_${post.uid}/subposts/subpost_${subUid}/texts/text_${uid}`, {uid: uid, content: "Description", type:"text", order: order}, ()=>{
        setValue(value+1);
      })
    })
  }

  const setTypeAndSaveHandler = (e, text, type) => {
    let textarea = e.target.closest(".edit-post__text-wrapper").querySelector("textarea");
    updateInfo(`Posts/post_${post.uid}/subposts/subpost_${subUid}/texts/text_${text.uid}/type`, type, ()=>{
      updateInfo(`Posts/post_${post.uid}/subposts/subpost_${subUid}/texts/text_${text.uid}/content`, textarea.value, ()=>{
        setValue(value+1);
      })
    })
  }

  const updateTextsOrderHandler = (e, direction, text, texts) => {
    if(direction==="up"){
      updateOrder(`Posts/post_${post.uid}/subposts/subpost_${subUid}/texts`, `text_${texts.find(txt=>txt.order===text.order-1).uid}`, text.order,()=>{
        updateOrder(`Posts/post_${post.uid}/subposts/subpost_${subUid}/texts`, `text_${text.uid}`, text.order-1, ()=>{
          setValue(value+1);
        })
      })
    }
    else if(direction==="down"){
      updateOrder(`Posts/post_${post.uid}/subposts/subpost_${subUid}/texts`, `text_${texts.find(txt=>txt.order===text.order+1).uid}`, text.order,()=>{
        updateOrder(`Posts/post_${post.uid}/subposts/subpost_${subUid}/texts`, `text_${text.uid}`, text.order+1, ()=>{
          setValue(value+1);
        })
      })
    }
    else{
      console.log("error")
    }
  }

  const deleteTextHandler = (e, text) => {
    removeInfo(`Posts/post_${post.uid}/subposts/subpost_${subUid}/texts/text_${text.uid}`, ()=>{
      if(Object.values(subpost.texts).length === 1){
        setValue(value+1)
      }
      else{
        Object.values(subpost.texts)
        .filter(txt=>txt.uid!==text.uid)
        .sort((txt1, txt2)=>txt1.order-txt2.order)
        .forEach((txt, index)=>{
          updateOrder(`Posts/post_${post.uid}/subposts/subpost_${subUid}/texts`, `text_${txt.uid}`, index+1, ()=>{
            if(index===Object.values(subpost.texts).filter(txt=>txt.uid!==text.uid).length-1)
            setValue(value+1)
          })
        })
      }
    })
  }
  
  return (
    subpost &&
    <article className='edit-post'>
      <div style={{padding: "0 80px", display: "flex", columnGap: 80, justifyContent: "center"}} className="edit-post__container container">
        <Stack>
          <div style={{width: 200, marginBottom: 40, display: "flex", flexDirection: "column", rowGap: 40}} className="edit-post__images">
          {
            subpost.images && 
            Object.values(subpost.images)
            .sort((image1, image2)=>image1.order - image2.order)
            .map((image, index)=>{return(
              <Card className="edit-post__image-block" key={index}> 
                <img width="867" height="867" src={image.url} alt="" />
                <Stack spacing={1} direction="row" sx={{justifyContent: "center", marginBottom: "10px", marginTop: "10px"}}>
                  <Button onClick={e=>updateOrderHandler(e, "up", image, Object.values(subpost.images))} disabled={image.order===1} variant="contained">↑</Button>
                  <Button onClick={e=>updateOrderHandler(e, "down", image, Object.values(subpost.images))} disabled={image.order===Object.values(subpost.images).length} variant="contained">↓</Button>
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
          <Button onClick={e=>{removeSubpostHandler(e)}} sx={{marginTop: "40px"}} variant="outlined" color="error">Remove Post</Button>
        </Stack>

        <Stack spacing={3} sx={{flex: "0 1 min(100%, 500px)"}}>
          <Stack direction="row" spacing={2} sx={{alignItems: "center"}}>
            <input style={{border: "2px solid black", borderRadius: "4px", padding: "4px"}} className='edit-post__name-input title' type="text" />
            <Button onClick={e=>{setNameHandler(e)}} variant="contained">Set new name</Button>
          </Stack>
          <Stack direction="column" spacing={2} sx={{alignItems: "normal"}}>
              {
                subpost.texts && 
                Object.values(subpost.texts)
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
                      <Button onClick={(e)=>updateTextsOrderHandler(e, "up", text, Object.values(subpost.texts))} disabled={text.order===1} sx={{padding: "0", lineHeight: "1.2"}} variant="contained">▲</Button>
                      <Button onClick={(e)=>updateTextsOrderHandler(e, "down", text, Object.values(subpost.texts))} disabled={text.order===Object.values(subpost.texts).length} sx={{padding: "0", lineHeight: "1.2"}}   variant="contained">▼</Button>
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