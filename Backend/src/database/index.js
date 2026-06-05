import mongoose from "mongoose";

const connectDB =async () => {
    try{
        const connectionInstances = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`DATABASE HAS BEEN CONNECTED SUCCESSFULLY !! DB HOST : ${connectionInstances.connection.host}`); 
    }
    catch(error){
        console.error(`FAILED CONNECTION `, error);
        process.exit(1);
    }
};

export default connectDB;