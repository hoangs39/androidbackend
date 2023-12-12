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
const sitesSchema = new mongoose.Schema({
    "name": String,
    "longitude": String,
    "latitude": String,
    "description" : String,
    "owner": String,
    "registers": [String]
});

const sites = new mongoose.model('Site', sitesSchema, 'Sites') 


const changeSchema = new mongoose.Schema({
    "changes": String,
    "editor": String,
})

const changes = new mongoose.model('Change', changeSchema, 'Changes') 

const userSchema = new mongoose.Schema({
    "role" : String,
    "name": String,
    "password": String,
})

const users = new mongoose.model('User', userSchema, 'Users') // name - schema - collection

// Data handler

//done
app.get('/sites', async (req, res) => {
    try {
        const found_sites = await sites.find();
        const found_changes = await changes.find();
        if(found_sites != null){
            res.status(200).send({
                sites: found_sites,
                changes : found_changes,
            });
        }else{
            res.status(404).send("No Avaiable Sites");
        }
        
    } catch (error) {
        console.log(error);
    }
});

//done
app.get('/findSites/:name', async (req, res) => {
    try {
        const found_sites = await sites.find({ owner: req.params.name});
        if (found_sites != null) {
            res.status(200).send(found_sites);
        } else {
            res.status(404).send([]);
        }

    } catch (error) {
        console.log(error);
    }
});

//done
app.get('/findSite/:name', async (req, res) => {
    try {
        const found_site = await sites.findOne({ name: req.params.name });
        if (found_site != null) {
            res.status(200).send(found_site);
        } else {
            res.status(404).send("Cant Find Site");
        }

    } catch (error) {
        console.log(error);
    }
});

//done
app.post('/createSite', async (req, res) => {
    try {
       const name = req.body.name;
       const latitude = req.body.latitude;
       const longtitude = req.body.longtitude;
       const description = req.body.description;
    //    const userId = req.body.userId;
        const userName = req.body.userName;
       const registers = [];
        console.log({
            name,
            latitude,
            longitude,
            owner: userName,
            description,
            registers,
        });

        // const found_user = await users.findOne({_id: userId});
       const newSite = await new sites({
            name,
            latitude,
            longitude,
            owner: userName,
            description,
            registers,
       })
       await newSite.save();
        const change = await new changes({
            changes: "Created site with name: " + name,
            editor: userName,
        })
        console.log({
            changes: "Created site with name: " + name,
            editor: userName,
        })
        await change.save();
       res.status(200).send("Created Successfully!")
    } catch (error) {
        console.log(error);
    }
});

//done
app.post('/joinSite/:name', async (req, res) => {
    try {
        const name = req.params.name;
        
        const register = req.body.userName;
        console.log(register)
        
        const found_site = await sites.findOne({ name });
        console.log(found_site.registers)
        const registers = [...found_site.registers];
        registers.push(register);
        const found_site2 = await sites.findOneAndUpdate({ name }, { registers }, {new : true});
        console.log(found_site2)

        if(found_site != null){
            res.status(200).send("Successfully Joined!");
        }else{
            res.status(404).send("Failed To Join!");
        }
    } catch (error) {
        console.log(error);
    }
});



//done
app.delete('/deleteSite/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const userName = req.body.userName;
        const delete_site = await sites.findOneAndDelete({
            name
        });
        // const found_user = users.findOne({ _id: userId });
        if (delete_site != null) {
            const change = await new changes({
                changes: "Deleted site with Name: " + name,
                editor: userName,
            })
            await change.save();
            res.status(200).send("Delete Completely")
        } else {
            res.status(500).send("Failed To Delete!")
        }

    } catch (error) {
        console.log(error);
    }
})
//done
app.put('/changeSite/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const siteName = req.body.siteName;
        const siteLatitute = req.body.siteLatitute;
        const siteLongitude = req.body.siteLongitude;
        const description = req.body.description;
        const userName = req.body.userName;
        // const found_user = users.findOne({ name: userName });
        const updated_site = await sites.findOneAndUpdate({ name }, {
            name: siteName,
            latitude: siteLatitute,
            longtitude: siteLongitude,
            description
        }, { },);
        if (updated_site != null) {
            const change = await new changes({
                changes: "Updated site with name: " + siteName,
                editor: userName,
            })
            await change.save();
            res.status(200).send("Updated Completely")
        } else {
            res.status(500).send("Failed To Update!")
        }

    } catch (error) {
        console.log(error);
    }
})

//done
app.post("/authentication", async (req, res) => {
    try {
        const name = req.body.name;
        const password = req.body.password;
        console.log(name + password);
        const user = await users.findOne({ name, password });
        if (user != null) {
            res.status(200).send(user);
        } else {
            res.status(404).send("Not Allowed!");
        }
    } catch (error) {
        console.log(error);
    }
});

// done
app.post('/register', async (req, res) => {
    try {
        const name = req.body.name;
        const role = req.body.role;
        const password = req.body.password;
        console.log(role+name+password);
        const user = await new users({
            role,
            name,
            password
        })
        await user.save();
        res.status(200).send("User Created!");
    } catch (error) {
        console.log(error);
    }
})




//done
app.delete('/deleteUser/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const delete_user = await users.findOneAndDelete({
            name
        });
        
        if (delete_user != null) {
            
            res.status(200).send("Delete Completely")
        } else {
            res.status(500).send("Failed To Delete!")
        }
    } catch (error) {
        console.log(error);
    }
})

//done
app.get('/users', async (req, res) => {
    try {
        const found_users = await users.find();
        if (found_users != null) {
            res.status(200).send(found_users);
        } else {
            res.status(404).send("Not Found!")
        }
    } catch (error) {
        console.log(error);
    }
})

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