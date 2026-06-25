import mongoose from "mongoose";

async function databaseConnection(url)
{
    await
    mongoose
    .connect(url)
    .then(() => {console.log("mongo db connected!!!")})
    .catch((err) => {console.log("Error",err)})
}

export default databaseConnection;