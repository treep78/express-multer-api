'use strict';

const fs = require('fs');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

//const mime = require('mime');
const path = require('path');

const crypto = require('crypto');

const s3upload = function(file){
  //let contentType = mime.lookup(file.path);
  let ext = path.extname(file.originalname);
  let folder = new Date().toISOString().split('T')[0];
  let stream = fs.createReadStream(file.path);
  let bucket = process.env.AWS_S3_BUCKET_NAME;

  return new Promise((resolve, reject)=>{
    crypto.randomBytes(16, (error,buffer)=>{
      if(error){
        reject(error);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  })
  .then((filename)=>{
    let key = `${folder}/${filename}${ext}`;
    let params = {
      ACL: 'public-read',
      Bucket: bucket,
      Key: key,
      Body: stream,
      ContentType:  file.mimetype,
    };

    return new Promise((resolve, reject)=>{
      s3.upload(params, (error, data)=>{
        if(error){
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  });
};




module.exports = s3upload;
