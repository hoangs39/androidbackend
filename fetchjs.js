// async function postData(url,data){
//     const response = await fetch(url, {
//         method: "POST",
//         mode: "cors",
//         cache: "no-cache",
//         credentials: "same-origin",
//         headers: {
//             "Content-type": "application/json"
//         },
//         redirect: "follow",
//         referrerPolicy: "no-referrer",
//         body: JSON.stringify(data)
//     })
//     // console.log(response);
//     return response;
// }

// postData("http://localhost:8000/createStudent", { 
//     email: 's3927241@rmit.edu.vn',
//     password: '12345678910',
//     phone: '09999999999',
//     address: 'Somewhere on Mars'
// }).then((data) => {
//     console.log(data);
// });

// postData(`http://localhost:8000/createStudent/${"s3927241@rmit.edu.vn"}`, {
//     email: 's3927241@rmit.edu.vn',
//     password: '12345678910',
//     phone: '09999999999',
//     address: 'Somewhere on Mars'
// }).then((data) => {
//     console.log(data);
// });

// var fs = require('fs');
// import * as fs from 'node:fs';

// async function uploadFiles (url){
//     const formData = new FormData();

//     formData.set("file", file, "index.js");
//  const response = await fetch(url, {
//      method: "POST",
//      body: formData,
//  })

//  return response;
// }

// const { default: axios } = require("axios")
// const fs = require('fs');
import fs from "fs";
import fetch from "node-fetch";


async function postFile(){
// const path = './index.js'
// const file = fs.readFileSync(path) /** Read file */

// const stats = fs.statSync(path) /** Get file size in bytes (for content-length) */
// const fileSizeInBytes = stats.size;


// /** Add appropriate headers */
// const headers = {
//     'Authorization': 'Bearer Your Token', /** Optional */
//     'Content-Length': fileSizeInBytes, /** Recommended to add it */
//     'Content-Type': 'application/octet-stream',
// }
// let url = "http://localhost:8000/uploadFiles"

// axios.post(url, file, {
//     headers: headers,
//     maxContentLength: Infinity, /** To avoid max content length error */
//     maxBodyLength: Infinity /** To avoid max body length error */
// }).then((response) => {
//     console.log(response.data);
//     return response.data
// }).catch((error) => {
//     return error
// })

const filePath = "./index.js"
const fileName = "index.js"
const formData = new FormData();

formData.append('file',new Blob(fs.readFileSync(filePath), {type: "applicaion/file"}), {fileName: fileName});

    fetch("http://localhost:8000/uploadFiles", {
        method: "POST",
        body: formData
    }).then(
        res => res.json()
    ).then(
        data => console.log(data)
    ).catch(
        err => console.log(err)
    )

}

postFile();
