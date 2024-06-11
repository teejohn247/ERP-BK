const multer = require('multer');
const multerGoogleStorage = require('multer-cloud-storage');

const upload = multer({
  storage: multerGoogleStorage.storageEngine({
    bucket: 'hrm-storage-bucket-1',
    projectId: ivory.project_id,
    keyFilename: path.join(__dirname, './ivory.json'),
    acl: 'publicRead',
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

module.exports = upload;

// const storagegoogle = new Storage({
//     project_id: ivory.project_id,
//     keyFilename: path.join(__dirname, './ivory.json')
//   });
// const bucketName = 'hrm-storage-bucket-1';
// console.log({file, fieldName});
// const bucket = storagegoogle.bucket('hrm-storage-bucket-1');
// const gcsFileName = `${Date.now()}_${file.originalname}`;