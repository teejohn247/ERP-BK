import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const url = process.env.MONGO_URL


const connectDB = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDb connected...')
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}
export default connectDB;




// const DB_PASSWORD = process.env.DB_PASSWORD
// const DB_USERNAME = process.env.DB_USERNAME

//  const connectDb = async (req, res, next) => {
//     console.log('ll')


//     const tenantId = req.headers['x-tenant-id'];

//     console.log(tenantId)

//     const tenantUrl = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@nigeniussms.bn17v0s.mongodb.net/${tenantId}?retryWrites=true&w=majority`

//     if (tenantId) {
//         try {
//             const usedDb = await mongoose.connect(tenantUrl, {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true
//             })
//             console.log('MongoDb Tenant connected...')
//             return mongoose.model('User', userSchema);

//         } catch (err) {
//             console.error(err.message);
//             process.exit(1);
//         }
//     } else {
//         console.log('ll')
//         try {
//             await mongoose.connect(url, {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true
//             });
//             console.log('MongoDb connected...')
//         } catch (err) {
//             console.error(err.message);
//             process.exit(1);
//         }

//     }

//     next();

// };
// export default connectDb;
// const connect = (req, res, next) => {
//   const tenantId = req.headers['x-tenant-id'];

//   console.log(tenantId)

//   if(tenantId){
//     getTenantDB(tenantId)
//   }else{
//   console.log('ll')

//   }
//   next()
// };