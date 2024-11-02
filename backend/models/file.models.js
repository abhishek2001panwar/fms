// server/models/File.js

import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Trim whitespace from the title
    },
    filename: {
        type: String,
        required: true,
        trim: true, // Trim whitespace from the filename
    },
    filepath: {
        type: String,
        required: true,
        trim: true, // Trim whitespace from the filepath
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
    size: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    passcode: {
        type: String,
        required: false,
        trim: true, // Trim whitespace from the passcode if it exists
    },
    isEncrypted: {
        type: Boolean,
        
    },
    permissions: {
        type: [String], // Array of strings to specify permissions
        default: ['read', 'write'], // Default permissions can be set as required
    },
    isShareable: {
        type: Boolean
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

// Create a model from the schema
export const File = mongoose.model('File', fileSchema);


