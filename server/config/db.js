import mongoos from "mongoose"
const connectDB = async () => {
  try {
    const connect = await mongoos.connect(process.env.MONGO_URI)
    console.log(`mongoBD Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1)
  }
}

export default connectDB