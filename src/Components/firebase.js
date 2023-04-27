import React, {useState, useEffect, useMemo} from 'react'
import { initializeApp } from "firebase/app";
import { ref as refSt, getStorage, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref, get, getDatabase, set, remove } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChhaDQa6c54nXKIu0OVFcrKJR3kLSr7Sc",
  authDomain: "new-app-84f38.firebaseapp.com",
  databaseURL: "https://new-app-84f38-default-rtdb.firebaseio.com",
  projectId: "new-app-84f38",
  storageBucket: "new-app-84f38.appspot.com",
  messagingSenderId: "281315390423",
  appId: "1:281315390423:web:6e1cc737bd9660c73a1192"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);
export const auth = getAuth(app);

export function signIn(email, password, callback = ()=>{}){
  signInWithEmailAndPassword(auth, email, password).then((promise)=>{
    callback(promise);
  }).catch(error=>{console.log(error); alert(error.message)});
}

export function logOut(){
  signOut(auth);
}

export function getPosts(location, callback){
  get(ref(database, `${location}`)).then(promise=>{
    if(!promise.val()) return;
    if(Object.values(promise.val())){
      const imagesArray = Object.values(promise.val());
      callback(imagesArray);
    }
  });
}

export function getInfo(location, callback){
  get(ref(database, `${location}`)).then(promise=>{
    if(!promise.val()) return;
    if(Object.values(promise.val())){
      const imagesArray = promise.val();
      callback(imagesArray);
    }
  });
}

export function uploadImage(location, image, name, object, callback = () => {}){
  const addToDatabase = (imageUrl, databaseURL, name) => {
    const databaseRef = ref(database, `${databaseURL}/${name}`);
    set( databaseRef, {
      url: imageUrl,
      name: name,
      ...object
    })
  }
  const imageRef = refSt(storage, `Images${location}/${name}`);
  uploadBytes(imageRef, image).then(()=>{
    getDownloadURL(imageRef).then(imageUrl=>{
      addToDatabase(imageUrl, location, name);
      callback(imageUrl);
    });
  });
}

export function uploadImageMain(location, imageUrl, name, object, callback = () => {}){
  const addToDatabase = (imageUrl, databaseURL, name) => {
    const databaseRef = ref(database, `${databaseURL}/${name}`);
    set( databaseRef, {
      url: imageUrl,
      name: name,
      ...object
    }).then(callback());
  }
  addToDatabase(imageUrl, location, name);
}


export function updateOrder(location, name, order, callback = ()=>{}){
  const databaseRef = ref(database, `${location}/${name}/order`);
  set( databaseRef, order).then(promise => {callback(promise)});
}


export function removeImage(databaseLocation, storageLocation, callback = ()=>{}){
  deleteObject(refSt(storage, storageLocation));
  remove(ref(database, databaseLocation)).then((promise)=>{
    callback(promise);  
  });
}

export function removeImageMain(databaseLocation, callback = ()=>{}){
  remove(ref(database, databaseLocation)).then((promise)=>{
    callback(promise);  
  });
}

export function updateInfo(location, info, callback = ()=>{}){
  set( ref(database, location), info).then((promise)=>{callback(promise)});
}

// export function updateKey(location, info, callback = () => {}){
//   update(ref(database, location), info).then((promise)=>{callback(promise)});
// }