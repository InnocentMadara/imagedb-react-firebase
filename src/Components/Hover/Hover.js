import React from 'react'
import { getInfo, getPosts, removeImage, removeImageMain, updateOrder } from '../firebase';


export default function Hover(props) {
  let showDelete = props.showDelete;

  const location = props.location;
  const image = props.image;
  const index = props.index;
  const images = props.images;
  const update = ()=>{props.update()};

  return (
    <div className="post__hover">
      <p className="post__text">Order: <span>{image.order}</span></p>
      <p className="post__text">Name: <span>{image.name}</span></p>
      <p style={{whiteSpace: "pre-wrap",  fontSize: "12px"}} className="post__text">Description: <br/><span>{image.description}</span></p>
      {showDelete !== false && (<button onClick={()=>{
        removeImage(`${location}/${image.name}`,`Images${location}/${image.name}`,()=>{
          update();
          images
          .filter(img=> img && img.name !== image.name)
          .forEach((img, index)=>{
            updateOrder(location, img.name, index + 1);
          })

          removeImageMain(`Main/${image.name}`, ()=>{
            getPosts("Main", (images)=>{
              images
              .filter(image=>image)
              .sort((image1, image2)=>{
                return image1.order - image2.order;
              })
              .forEach((img, index)=>{
                updateOrder("Main", img.name ,index + 1);
              })
              alert("Image was deleted");
            })
          });
          

        });
      }} className="post__remove-button">✖</button>)}
      {index !== 0 && (<button onClick={()=>{
        updateOrder(location, image.name, --image.order);
        updateOrder(location, images[index-1].name, ++image.order, ()=>{update()});
      }} className='post__order-button post__order-button--left'> {"<"} </button>)}
      {index !== images.length-1 && (<button onClick={()=>{
        updateOrder(location, image.name, ++image.order);
        updateOrder(location, images[index+1].name, --image.order, ()=>{update()});
      }} className='post__order-button post__order-button--right'> {">"} </button>)}
    </div>
  )
}
