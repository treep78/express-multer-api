'use strict';

const fs = require('fs');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const mime = require('mime');
const path = require('path');

const s3upload = function(file){
  let contentType = mime.lookup(file.path);
  let ext = path.extname(file.path);

  let folder = new Date().toISOString().split('T')[0];

  let stream = fs.createReadStream(file.path);
  let bucket = process.env.AWS_S3_BUCKET_NAME;
  let key = `${folder}/${file.title}${ext}`;
  let params = {
    ACL: 'public-read',
    Bucket: bucket,
    Key: key,
    Body: stream,
    ContentType:  contentType
  };
    s3.upload(params, (data, error) => {
      if(error) {
        console.log(error);
      } else {
        console.log(error);
      }
    });
  };




module.exports = s3upload;
