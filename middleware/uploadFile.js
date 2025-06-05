import cloudinary from 'cloudinary';

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

const imageUploader = async (req, res, next) => {
  try {
    console.log('File received:', req.file);
    
    // Only process file if one was actually uploaded
    if (req.file && req.file.path) {
      const fs = require('fs');
      const fileData = fs.readFileSync(req.file.path);
      const b64 = fileData.toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      
      // Delete local temp file
      fs.unlinkSync(req.file.path);
      
      // Set the image URL in req.body
      req.body.image = cldRes.secure_url;
      console.log('File uploaded to Cloudinary:', cldRes.secure_url);
    } else {
      console.log('No file attached, continuing without image upload');
    }
   
    next();
  } catch (error) {
    console.error('Error in image uploader middleware:', error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
}

export default imageUploader;