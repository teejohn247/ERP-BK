import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db'
import userRouter from './routes/adminRoute';
import Debug from 'debug';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';
import multer from 'multer';
import DeviceDetector from 'node-device-detector';
import middlewareDetect from './middleware/middlewareDetect'

const upload = multer()

const app = express();
dotenv.config();

app.use(express.json());
// app.use(upload.single());÷

app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}))

const server = http.createServer(app);
const { Server } = require("socket.io");



app.use(express.static('public'));



// init deviceDetector
const deviceDetector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});


const hasBotResult = (result) => {
  return result && result.name;
}


// attach middleware
app.use(middlewareDetect);



// app.use(logger('dev'));
// app.use(express.static(__dirname + '/public'));

app.use(express.static('public')); 
app.use('/images', express.static('images'));

// app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', "*");
  next();
};
app.use(allowCrossDomain);


const port = process.env.PORT || 6000;
const debug = Debug('http');

connectDb()


let hostname = '0.0.0.0'

app.get('/test', (req, res) => {
  res.json({
    message: 'Welcome to silo ERP Api'
  });
});

app.use('/api/v1', userRouter);

server.listen(process.env.PORT || 6000, () => console.log(`Server has started. ${port}`));

export default app;
