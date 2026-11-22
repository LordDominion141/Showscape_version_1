import mongoose from 'mongoose';

const InstallationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User ID not found'],
        ref: 'User'
    },
    // GITHUB INSTALLATION iD
    installationId: {
        type: String,
        required: [true, 'Github InstallationId not found'],
    },
    repoFullName: {
        type: String,
        required: [true, 'Repository fullname is required'],
        trim: true,
    },
    permissions: {
        type: String,
        required: true,
        enum: ['read', 'write']
    },
    InstalledAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {timestamps: true});

const Installation = mongoose.models.Installation || mongoose.model('Installation', InstallationSchema);

export default Installation;