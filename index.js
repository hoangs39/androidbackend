// const express = require('express')
// const mongoose = require('mongoose')
// const cors = require('cors')

import express from "express";
import mongoose, { Schema }  from "mongoose";
import cors from "cors";
// import multer  from "multer";
import bodyParser from "body-parser";
const app = express()
// const bodyParser = require('body-parser');
// const multer = require('multer');



// const storage = multer.diskStorage(
//     {
//         destination: function (req, file, cb) {
//             cb(null, './uploads/');
//         },
//         filename: function (req, file, cb) {
//             cb(null, new Date().toISOString() + file.originalname);
//         }
//     });


// const upload = multer(
// {
//         storage: storage,
// });



// const connection_string = "mongodb+srv://thinhdeptrai:T12namhsgioiT@cluster02703.syx3xrh.mongodb.net/test?retryWrites=true&w=majority"
const connection_string = "mongodb+srv://hoang:hoang@android.vy1i5cg.mongodb.net/UsersDB?retryWrites=true&w=majority"

mongoose.connect(connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

// code here
// Schema handler
const eventsSchema = new mongoose.Schema({
    "name": String,
    "longtitude": String,
    "latitude": String,
    "address": String,
})
const events = new mongoose.model('Event', eventsSchema, 'Events') 

const userSchema = new mongoose.Schema({
    "role" : String,
    "name": String,
    "password": String,
    "phone": String,
    "address": String,
    "joinEvent": [{ type: Schema.Types.ObjectId, ref: 'Events' },],
    "createEvent": [{ type: Schema.Types.ObjectId, ref: "Events" }],
})



const users = new mongoose.model('User', userSchema, 'Users') // name - schema - collection

// Data handler
app.get('/printAllData', async (req, res) => {
    try {
        console.log(1)
        const found_student = await users.findOne();
        const id = `${found_student.joinEvent[1]}`
        const found_Event = await events.findOne({
            "_id": id,
        })
        console.log(found_Event);
        res.send(found_Event);
    } catch (error) {
        console.log(error);
    }
});

// app.post('/createStudent', async (req,res) => {
//     try{
//         console.log(req.body);
//     }catch (error){
//         res.status(500).send("Post Failed!");
//     }
// })

// app.post("/uploadFiles", upload.array('image', 12), (req, res, next) => {
//     // if (!req.files)
//     //     return res.send('Please upload files');
//     console.log(req)

// });

// app.post("/uploadFiles", (req,res) => {
//     console.log(req.body);
// })


// app.post('/createStudent/:name', async (req, res) => {
//     try {
//         console.log(req.params.name);
//         const student = await students.find(req.params.name);
//         console.log(student);
//     } catch (error) {
//         res.status(500).send("Post Failed!");
//     }
// })

// app.post('/uploadFiles', async (req, res) => {
//     try {
//         console.log(req);
//     } catch (error) {
//         res.status(500).send("Post Failed!");
//     }
// })

const port = process.env.PORT || 8000;
app.listen(port, () => console.log("Express Server started on port 8000"));