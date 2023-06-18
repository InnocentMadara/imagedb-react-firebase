import React, {useMemo, useState} from 'react'
import { getInfo, updateInfo } from './firebase'
import { Card, CardActionArea, CardMedia, Typography, Button, Grid, CardContent, Box } from '@mui/material';
import Masonry from 'react-masonry-css';
import "../Styles/Edit.scss"
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';
import { update } from 'firebase/database';

export default function Edit() {
  const [value, setValue] = useState(0);
  const [posts, setPosts] = useState({});

  useMemo(()=>{
    getInfo("/Posts", (posts)=>{
      setPosts(posts)
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
  
  const newPostHandler = (e) => {
    let uid = v4();

    getInfo("/", db=>{
      let posts, count;
      if(db.posts){ 
        posts = db.posts;
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


  return (
    <section className='edit'>
    <div className="edit__container">
      <Masonry 
      breakpointCols={{default: 3, 769: 2, 681: 1}}
      className="edit__masonry masonry"
      columnClassName="masonry__column"
      >
        {
          Object.values(posts).map((post, index)=>{
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
