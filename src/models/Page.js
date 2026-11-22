import mongoose from 'mongoose';
import validator from 'validator';

const PageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    installationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Installation',
        required: true
    },
    templateId: {
        type: String,
        required: true
    },
    rawMarkdown: {
        type: String,
        required: true,
        trim: true
    },
    customDomain: {
        type: String,
        validate: [validator.isURL, 'Invalid Domain name']
    },
    watermarkEnabled: {
        type: Boolean,
        required: true,
        default: true
    },
    lastSyncedFrom: {
        type: String,
        required: true,
        enum: ['github', 'dashboard', 'vscode']
    }
}, {timestamps: true});


const Page = mongoose.models.Page || mongoose.model('Page', PageSchema);

export default Page;