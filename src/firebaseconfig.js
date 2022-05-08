import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, list } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCGGLjHEzb-NhM7cVjA1mhVuTQu6DNmHX4",
    authDomain: "weddingpictures-a5e0e.firebaseapp.com",
    projectId: "weddingpictures-a5e0e",
    storageBucket: "weddingpictures-a5e0e.appspot.com",
    messagingSenderId: "197328880056",
    appId: "1:197328880056:web:bb37f94b560ff24c03cf4d",
    measurementId: "G-K9H20W9YVH"
    };

    export const firebaseApp = initializeApp(firebaseConfig);

    // const storage = getStorage(firebaseApp);
    // const pathReference = ref(storage, 'gs://weddingpictures-a5e0e.appspot.com/marriage');
    // console.log(pathReference);

    // list(pathReference, { maxResults: 15})
    //     .then((result) => {
    //         console.log(result)
    //         result.items.forEach((item) => {
    //             getDownloadURL(item)
    //             .then((url) => {
    //                 let div = document.getElementById('imageList');
    //                 let img = document.createElement('img');
    //                 img.className = 'myImage';
    //                 img.src = url;
    //                 div.appendChild(img);
    //             })
    //             .catch((e) => {
    //                 console.log(e);
    //             })
    //         })
            
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     })