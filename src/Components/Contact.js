import React, { useMemo, useRef, useState } from 'react';
import '../Styles/Contact.scss';
import { getInfo, updateInfo } from './firebase';


export default function Contact(props) {
  const isEdit = props.isEdit;
  const [value, setValue] = useState(0);
  const [text, setText] = useState();

  useMemo(()=>{
    getInfo("Contact", (info)=>{
      setText(info.text);
    });
  },[value])

  const editText = useRef();
  const buttons = useRef();
  const textItem = useRef();
  
  return (
    <section className='contact'>
      <div className="contact__container container">
      <div className="contact__text-block">

        <p ref={textItem} className="contact__text" onDoubleClick={(e)=>{
          if(isEdit){
            editText.current.hidden = false;
            editText.current.value = textItem.current.innerText;
            editText.current.select();
            buttons.current.hidden = false;
          }}}>
          {
            text
          }
        </p>
        <textarea ref={editText} type="text" className="contact__input" hidden/>
        <div ref={buttons} hidden className="contact__buttons" >
          <button onClick={()=>{
            if(isEdit){
              updateInfo("Contact/text", editText.current.value, ()=>{setValue(value + 1)});

              editText.current.hidden = true;
              buttons.current.hidden = true;
            }
          }}>✓</button>
          <button onClick={()=>{
            editText.current.hidden = true;
            buttons.current.hidden = true;
          }}>✗</button>
        </div>

      </div>
      </div>
    </section>
  )
}
