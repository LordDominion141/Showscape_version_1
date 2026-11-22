import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    githubId: {
        type: String,
        required: [true, 'Github ID not found'],
    },
    username: {
        type: String,
        required: [true, 'User name required'],
        trim: true,
    },
    name: String,
    email: String,
    image: String,
    payment: {
        type: String,
        default: 'free'
    }
}, {timestamps: true});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;