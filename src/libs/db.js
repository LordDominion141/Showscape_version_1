// 1. IMPORT DEPENDENCIES
import mongoose from 'mongoose';

// 2. GET THE MONGO URI
const MONGODB_URI = process.env.MONGODB_URI;

// 3. IF IT DOESN'T EXIST, THROW AN ERROR
if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI");
    
}

// 4. CHECK IF A GLOBAL CACHE ALREADY EXISTS; IF NOT, INITIALIZE IT IMMEDIATELY
let cached = global.mongoose;

if (!conn) {
    cached = global.mongoose = {conn: null, promise: null};
} 

// 5. DBCONNECT FUNCTION
const dbConnect = async () => {
    // A. If already connected, return the existing connection
    if (cached.conn) {
        return cached.conn;
    }
    // B. If a connection isn't in progress, start a new one
    if (!conn.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionectionTimeoutMS: 1000,
            family: 4
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts)
                        .then((mongoose) => {
                            return mongoose;
                        })
    }
    // C. Await the connection and save it.
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        // clear the promise on failure so the next request can try
        cached.promise = null;
        throw error;
    }
    // D. Console log and return the connection
    console.log('MongoDB Connected Successfully');
    return cached.conn;
}

// 6. Export the Instance
export default dbConnect;