import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getInfo, removeImageFromSt, removeInfo, updateInfo, updateOrder } from './firebase';
import Masonry from 'react-masonry-css';
import { Box, Button, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { v4 } from 'uuid';

export default function EditPost() {
  const {uid, subUid} = useParams();
  const [post, setPost] = useState({});
  const [value, setValue] = useState(0);

  useMemo(()=>{
    getInfo(`/Posts`, (posts)=>{
      setPost(Object.values(posts).filter(post=>post.uid===uid)[0]);
    })
  },[value])

  let postPattern = (uid, order) => { return {
    uid: uid,
    name: "New subpost",
    order: order,
    images:{

    }
  }}
  const newPostHandler = (e) => {
    let subUid = v4();

    getInfo(`/Posts/post_${uid}`, db=>{
      let posts, count;
      if(db.subposts){
        posts = db.subposts;
        count = Object.values(posts).length;
      }
      else(
        count = 0
      )
      updateInfo(`/Posts/post_${uid}/subposts/subpost_${subUid}`, postPattern(subUid, count+1), ()=>{
        setValue(value+1);
      });
    })
  }

  const setNewNameHandler = (e) => {
    let input = document.querySelector('.post__input');
    
    updateInfo(`/Posts/post_${uid}/name`, input.value, ()=>{
      setValue(value+1);
    });
  }

  const updateOrderHandler = (e, direction, post, posts) => {
    if(direction==="left"){
      updateOrder(`Posts/post_${uid}/subposts`, `subpost_${posts.find(pst=>pst.order===post.order-1).uid}`, post.order,()=>{
        updateOrder(`Posts/post_${uid}/subposts`, `subpost_${post.uid}`, post.order-1, ()=>{
          setValue(value+1);
        })
      })
    }
    else if(direction==="right"){
      updateOrder(`Posts/post_${uid}/subposts`, `subpost_${posts.find(pst=>pst.order===post.order+1).uid}`, post.order,()=>{
        updateOrder(`Posts/post_${uid}/subposts`, `subpost_${post.uid}`, post.order+1, ()=>{
          setValue(value+1);
        })
      })
    }
    else{
      console.log("error")
    }
  }

  const removePostHandler = (e) => {
    let imageArray = [];

    let subposts = post.subposts ? Object.values(post.subposts) : null;
    if(subposts){
      subposts.forEach(subpost=>{
        let imagesObj = subpost.images||{};
        let images = Object.values(imagesObj);
        if(images){
          images.forEach(image=>{
            imageArray.push(image)
          })
        }
      })
    }
    imageArray.forEach(img=>removeImageFromSt(`Images/${img.uid}`))
    removeInfo(`Posts/post_${post.uid}`, ()=>{
      getInfo(`/`, (db)=>{
        let posts = db.Posts || []
        let postList = Object.values(posts)
        .filter(post=>post.uid!==uid)
        .sort((post1, post2)=>post1.order-post2.order)||[]
        
        if(postList.length === 0){
          window.location.replace(window.location.origin + `/#/edit`)
        }
        else{
          postList.forEach((post, index)=>{
            updateOrder("Posts", `post_${post.uid}`, index+1, ()=>{
              if(index===postList.length-1){
                window.location.replace(window.location.origin + `/#/edit`)
              }
            })
          })
        }
      })
    })
  }

  return (
    <div className='post'>
      <div className="post__container" style={{flexDirection: "column"}}>
        <Stack spacing={2} direction="row" sx={{ marginBottom: "40px", justifyContent: "center"}}>
          <input style={{width: "500px"}} type="title" defaultValue={post.name} className="post__input title" />
          <Button onClick={(e)=>{setNewNameHandler(e)}} variant='contained'>Set new name</Button>
        </Stack>
        <Masonry
          breakpointCols={{default: 3, 769: 2, 681: 1}}
          className="main__masonry masonry"
          columnClassName="masonry__column">
            {
              Object.values(post).length > 0 &&  
              post.subposts &&  
              Object.values(post.subposts)
              .sort((subpost1, subpost2)=>subpost1.order-subpost2.order)
              .map(subpost=>{return(
                <Card key={subpost.uid}>
                  <Link to={`${subpost.uid}`}>
                    <CardMedia
                      component="img"
                      image={
                        subpost.images ?
                        Object.values(subpost.images).find(img=>img.order===1).url:
                        require("../Images/MissingImage.png")
                      }
                    />
                    <CardContent>
                      <p className='title'>
                        {subpost.name}
                      </p>
                    </CardContent>
                  </Link>
                  <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                    <Button onClick={e=>{updateOrderHandler(e, "left", subpost, Object.values(post.subposts) )}} disabled={subpost.order===1} variant='contained' >←</Button>
                    <h2 className="title">№{subpost.order}</h2>
                    <Button onClick={e=>{updateOrderHandler(e, "right", subpost, Object.values(post.subposts) )}} disabled={subpost.order===Object.values(post.subposts).length} variant='contained' >→</Button>
                  </Stack>
                </Card>
              )})
            }

            <Card>
            <Button onClick={e=>{newPostHandler(e)}} sx={{flexDirection: "column", width: "100%"}}>
              <Box sx={{fontSize: 72, margin: "50px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                +
              </Box>
              <CardContent style={{textTransform: "none"}}>
                <Typography>
                  Add new subpost
                </Typography>
              </CardContent>
            </Button>
          </Card>
        </Masonry>
        
        <Button onClick={e=>{removePostHandler(e)}} variant='outlined' color='error'>Remove post</Button>

      </div>
    </div>
  )
}