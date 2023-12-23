import cloudinary from 'cloudinary';

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res
}
const imageUploader = async (req, res, next) => {
  try {

    console.log(req.file)
    if(req.file){
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      console.log({cldRes})
      req.body.image = cldRes.secure_url;
    }

    console.log('here12')
   
    next()
    // res.json(cldRes);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
}

export default imageUploader