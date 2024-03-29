import cloudinary from 'cloudinary';

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res
}
const imageUploaderMultiple = async (req, res, next) => {
  try {
      console.log(req.file);
      if (req.file && req.file.length > 0) { // Check if files exist in the request
        console.log(req.file[0])
          const file = req.file[0]; // Access the first file in the array
          const b64 = Buffer.from(file.buffer).toString("base64"); // Convert file buffer to base64
          const dataURI = "data:" + file.mimetype + ";base64," + b64; // Create data URI
          console.log({dataURI})
          const cldRes = await handleUpload(dataURI); // Upload file to Cloudinary
          console.log({ cldRes });
          // Determine the field name based on the uploaded file
          if (file.fieldname === 'resumeCV') {
              req.body.cv = cldRes.secure_url; // Set CV URL in request body
          } else if (file.fieldname === 'coverLetterFile') {
              req.body.letter = cldRes.secure_url; // Set cover letter URL in request body
          } else {
              throw new Error('Invalid fieldname'); // Handle unexpected field name
          }
      }

      console.log('here12');
      next();
  } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message }); // Send error response
  }
}


export default imageUploaderMultiple;