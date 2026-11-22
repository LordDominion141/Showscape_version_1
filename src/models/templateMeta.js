import mongoose from 'mongoose';

const TemplateMetaSchema = new mongoose.Schema({
    templateName: {
        type: String,
        required: [true, 'Template name missing'],
        trim: true
    },
    templateId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: [true, 'Schema description is required'],
    },
    previewImage: {
        type: String,
        required: [true, 'Preview image url is required'],
    },
    tier: {
        type: String,
        required: true,
        enum: ['free', 'premium']
    },
    status: {
        type: String,
        required: true,
        enum: ['live', 'hidden']
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
}, {timestamps: true});

const TemplateMeta = mongoose.models.TemplateMeta || mongoose.model('TemplateMeta', TemplateMetaSchema);

export default TemplateMeta;