'use strict';

require('dotenv').load();
const fs = require('fs');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();


let file ={
  path: process.argv[2],
  title: process.argv[3]
};

console.log("File is: ",file);

let stream = fs.createReadStream(file.path);
let bucket = process.env.AWS_S3_BUCKET_NAME;
console.log("Bucket is: ",bucket);
let key = file.title;
let params = {
  ACL: 'public-read',
  Bucket: bucket,
  Key: key,
  Body: stream
};

s3.upload(params, (err, data)=>{
  if(err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
