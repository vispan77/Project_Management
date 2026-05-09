import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        const url = process.env.MONGODB_URL;
        await mongoose.connect(url);
        console.log("Db is connected successfully");
    } catch (error) {
        console.log("db error:- " + error.message);

    }
}

export default dbConnect;