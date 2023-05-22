const fs = require('fs');
const AWS = require('aws-sdk');



import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3'



dotenv.config();


const s3 = new AWS.S3({
    accessKeyId: process.env.AWSACCESSKEY,
    secretAccessKey: process.env.AWSSECRETKEY
});




const uploadFile = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWSBUCKETNAME, 
      metadata: function (req, file, cb) {
      
        cb(null, { fieldName: file.fieldname });
      }, 
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })

export default uploadFile;