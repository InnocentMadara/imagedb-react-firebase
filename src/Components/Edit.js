import React, {useEffect, useMemo, useState} from 'react'
import { getInfo, removeImageFromSt, updateInfo, updateOrder, uploadImageAbout } from './firebase'
import { Card, CardActionArea, CardMedia, Typography, Button, Grid, CardContent, Box, Stack } from '@mui/material';
import Masonry from 'react-masonry-css';
import "../Styles/Edit.scss"
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';

export default function Edit() {
  const [value, setValue] = useState(0);
  const [posts, setPosts] = useState({});
  const [about, setAbout] = useState({});
  const [contact, setContact] = useState({});
  const [image, setImage] = useState(null);

  useMemo(()=>{
    getInfo("/Posts", (posts)=>{
      setPosts(posts)
    })
    getInfo("/", (db)=>{
      setAbout(db.About);
      setContact(db.Contact)
    })
  },[value])

  let postPattern = (uid, order) => { return {
      uid: uid,
      name: "New post",
      description: "description for new post",
      order: order,
      images: {
      }
    }
  }

  useEffect(()=>{
    
    const tx = Array.from(document.getElementsByTagName("textarea"));
    tx.forEach((textarea)=>{
      textarea.setAttribute("style", "height:" + (textarea.scrollHeight) + "px;overflow-y:hidden;");
      textarea.addEventListener("input", OnInput, false);
      textarea.addEventListener("focus", OnInput, false);
      textarea.style.height = 0;
      textarea.style.height = (textarea.scrollHeight) + "px";
    })

    function OnInput() {
      this.style.height = 0;
      this.style.height = (this.scrollHeight) + "px";
    }
  },[about, value])
  
  const newPostHandler = (e) => {
    let uid = v4();

    getInfo("/", db=>{
      let posts, count;
      if(db.Posts){
        posts = db.Posts;
        count = Object.values(posts).length;
      }
      else(
        count = 0
      )
      updateInfo(`/Posts/post_${uid}`, postPattern(uid, count+1), ()=>{
        setValue(value+1);
      });
    })
  }

  const updateOrderHandler = (e, direction, post, posts) => {
    if(direction==="left"){
      updateOrder(`Posts`, `post_${posts.find(pst=>pst.order===post.order-1).uid}`, post.order,()=>{
        updateOrder(`Posts`, `post_${post.uid}`, post.order-1, ()=>{
          setValue(value+1);
        })
      })
    }
    else if(direction==="right"){
      updateOrder(`Posts`, `post_${posts.find(pst=>pst.order===post.order+1).uid}`, post.order,()=>{
        updateOrder(`Posts`, `post_${post.uid}`, post.order+1, ()=>{
          setValue(value+1);
        })
      })
    }
    else{
      console.log("error")
    }
  }

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
    getInfo("About/image", (img)=>{
      let uid = v4();

      removeImageFromSt(`Images/${img.uid}`)
      uploadImageAbout("About/image", image, uid, ()=>{setValue(value+1)});
    })
  }

  const setDescriptionHandler = (e, textareaClass, directory) => {
    let text = document.querySelector(`.${textareaClass}`).value;
    updateInfo(`${directory}/text`, text, ()=>{setValue(value+1)})
  }

  return (
    <section className='edit'>
    <div className="edit__container">

      <h2 className="edit__about-title title">About</h2>
      <div className="edit__about" style={{marginBottom: "40px"}}>
        <Stack direction="row" spacing={2} sx={{alignItems: "flex-start"}}>
          <div style={{display: "flex", flexDirection: "column", rowGap: "20px", maxWidth: "800px"}} className="edit-post__upload-image">
            <label className="edit__about-file-input file-input">
              <p className='file-input__text'>📥 Choose an image...</p>
              <input hidden className='inputfile' type="file" onChange={e=>{imageHandler(e, 867)}} accept="image/*"/>
            </label>
            <Button variant="contained" onClick={e=>{uploadImageHandler(e)}}>Replace image</Button>
          </div>
          {Object.values(about).length > 0 &&
            <Stack direction="row" spacing={2} sx={{alignItems: "center", width: "100%"}}>
            <textarea className="text about__textarea" defaultValue={about.text }></textarea>
            <Button onClick={e=>{setDescriptionHandler(e, "about__textarea", "About")}} variant="contained">Set description</Button>
          </Stack>}
        </Stack>
      </div>
      <h2 className="edit__contact-title title">Contact</h2>
      <div className="edit__contact" style={{marginBottom: "40px"}}>
      {Object.values(contact).length > 0 &&
            <Stack direction="row" spacing={2} sx={{alignItems: "center", width: "100%"}}>
            <textarea className="text contact__textarea" defaultValue={contact.text }></textarea>
            <Button onClick={e=>{setDescriptionHandler(e,"contact__textarea" , "Contact")}} variant="contained">Set description</Button>
          </Stack>}
      </div>
      <h2 className="title">Main</h2>
      <Masonry 
      breakpointCols={{default: 3, 769: 2, 681: 1}}
      className="edit__masonry masonry"
      columnClassName="masonry__column"
      >
        {
          Object.values(posts)
          .sort((pst1, pst2)=>pst1.order-pst2.order)
          .map((post, index)=>{
            return (
              <Card key={index}>
                <Link to={`/edit/${post.uid}`}>
                  <CardMedia
                    component="img"
                    image={
                      post.images ?
                      Object.values(post.images).find(img=>img.order===1).url:
                      require("../Images/MissingImage.png")
                    }
                  />
                  <CardContent>
                    <p className='title'>
                      {post.name}
                    </p>
                  </CardContent>
                </Link>
                <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                  <Button onClick={e=>{updateOrderHandler(e, "left", post, Object.values(posts) )}} disabled={post.order===1} variant='contained' >←</Button>
                  <h2 className="title">№{post.order}</h2>
                  <Button onClick={e=>{updateOrderHandler(e, "right", post, Object.values(posts) )}} disabled={post.order===Object.values(posts).length} variant='contained' >→</Button>
                </Stack>
              </Card>
            )
          })
        }
        <Card>
          <Button onClick={e=>{newPostHandler(e)}} sx={{flexDirection: "column", width: "100%"}}>
            <Box sx={{fontSize: 72, margin: "50px", display: "flex", justifyContent: "center", alignItems: "center"}}>
              +
            </Box>
            <CardContent style={{textTransform: "none"}}>
              <Typography>
                Add new post
              </Typography>
            </CardContent>
          </Button>
        </Card>
      </Masonry>
    </div>

    </section>
  )
}
