'use strict';

require('dotenv').load();
const s3Upload = require('../lib/aws-s3-upload.js');
const mongoose = require('../app/middleware/mongoose');
const Upload = require('../app/models/upload.js');
const mime = require('mime');

let file ={
  path: process.argv[2],
  originalname: process.argv[2],
  title: process.argv[3]
};

file.mimeType = mime.lookup(file.originalname);

s3Upload(file)
  .then((response)=>{
    console.log("inside the block");
    console.log("data is: ",response);
    return Upload.create({
      url: response.Location,
      title: file.title
    });
  })
  .catch(console.error)
  .then(()=>{
    mongoose.connection.close();
  });
