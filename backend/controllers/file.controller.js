import mongoose from 'mongoose';
import { File } from '../models/file.models.js';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import bcrypt from 'bcrypt';

export const getFiles = async (req, res) => {
    try {
        const files = await File.find();

        if (!files) {
            return res.status(404).json({ message: 'No files found.' });
        }


        return res.status(200).json({
            message: 'Files retrieved successfully',
            files,
        });
    } catch (error) {
        console.log(error);
        throw new Error(error);

    }
};


export const postFile = async (req, res) => {
    // Use the upload middleware


    // Ensure a file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { title, passcode, permissions, userId, isShareable , isEncrypted} = req.body;

    // Validate required fields
    if (!title || !userId) {
        return res.status(400).json({ message: 'Title and userId are required.' });
    }

    // // Log the uploaded file information for debugging
    // console.log('Creating new File:', {
    //     title,
    //     filename: req.file.filename,
    //     filepath: req.file.path,
    //     size: req.file.size,
    //     type: req.file.mimetype,
    //     passcode: passcode || '',
    //     permissions: permissions ? permissions.split(',') : ['read', 'write'],
    //     userId,
    // });

    const hashedPasscode = await bcrypt.hash(passcode, 10);

    console.log('Hashed Passcode:', hashedPasscode);

    try {
        // Create a new file record
        const newFile = new File({
            title,
            filename: req.file.filename,
            filepath: req.file.path,
            size: req.file.size,
            type: req.file.mimetype,
            passcode: hashedPasscode,
            isEncrypted: isEncrypted || false,
            isShareable: isShareable || false,
            permissions: permissions ? permissions.split(',') : ['read', 'write'],
            userId,
        });

        // Save the file record to the database
        await newFile.save();
        return res.status(201).json({ message: 'File uploaded successfully.', file: newFile });
    } catch (error) {
        console.error('Database Save Error:', error);
        return res.status(500).json({ message: 'Failed to save file metadata.', error: error.message });
    }

};

export const getOneFile = async (req, res) => {
    try {
        // Validate request parameters
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid file ID format.' });
        }

        // Find the file by ID
        const file = await File.findById(req.params.id);

        // Check if the file exists
        if (!file) {
            return res.status(404).json({ message: 'File not found.' });
        }

        // Check if the file is encrypted
        if (file.isEncrypted) {
            const { passcode } = req.body; // Get passcode from request body
            
            // Check if passcode is provided
            if (!passcode) {
                return res.status(400).json({ message: 'Passcode is required to access this file.' });
            }

            // Verify the passcode using bcrypt
            const isMatch = await bcrypt.compare(passcode, file.passcode); // Assuming file.passcode is the hashed passcode
            
            if (!isMatch) {
                return res.status(403).json({ message: 'Invalid passcode.' });
            }
        }

        // If everything is valid, return the file details
        return res.status(200).json({
            message: 'File retrieved successfully',
            file,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving file.', error: error.message });
    }
}

export const deleteFile = async (req, res) => {
    const { id } = req.params; // Destructure the id parameter from req.params

    // Validate ObjectId format
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid file ID format' });
    }

    try {
        const file = await File.findByIdAndDelete(id); // Wait for the deletion operation

        if (!file) {
            // If no file is found, return a 404 response
            return res.status(404).json({ message: 'File not found' });
        }

        return res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred while deleting the file', error: error.message });
    }
};


export const updateFile = async (req, res) => {
    try {

        const { id } = req.params;
        const { title, passcode, permissions } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid file ID format' });
        }
        const newFile = await File.findByIdAndUpdate(id, { title, passcode, permissions }, { new: true });
        if (!newFile) {
            return res.status(404).json({ message: 'File not found' });
        }
        return res.status(200).json({ message: 'File updated successfully', file: newFile });
    } catch (error) {
        console.log(error);
        throw new Error(error);

    }
}
export const downloadFile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid file ID format' });
        }

        // Use async/await to find the file
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Set the file headers
        res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
        res.setHeader('Content-Type', file.type);

        // Send the file stream
        res.download(file.filepath, file.filename);

    } catch (error) {
        console.error('Download Error:', error);
        return res.status(500).json({ message: 'Failed to download file', error: error.message });
    }
};
export const shareFile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid file ID format' });
        }

        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Create a shareable link (example)
        const shareableLink = `${req.protocol}://${req.get('host')}/api/v1/file/download/${file._id}`;

        return res.status(200).json({ message: 'File shared successfully', link: shareableLink });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error sharing file', error: error.message });
    }
};
export const unshareFile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid file ID format' });
        }

        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Here, you could change the isShareable property to false
        file.isShareable = false; // Or implement your own logic to unshare

        await file.save(); // Save the updated file

        return res.status(200).json({ message: 'File unshared successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error unsharing file', error: error.message });
    }
};

export const encryptFile = async (req, res) => {
    try {
        const { id } = req.params; // File ID from request parameters
        const { passcode } = req.body; // Get passcode from request body

        if (!passcode) {
            return res.status(400).json({ message: 'Passcode is required' });
        }

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid file ID format' });
        }

        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Encryption logic
        const algorithm = 'aes-256-cbc';
        const key = crypto.createHash('sha256').update(passcode).digest(); // Generate key from passcode
        const iv = crypto.randomBytes(16); // Generate a random IV

        // Read the file
        const filePath = file.filepath;
        const fileBuffer = fs.readFileSync(filePath);

        // Create a cipher
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        // Encrypt the file
        let encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);

        // Define the encrypted file path
        const encryptedFilePath = path.join('uploads', `encrypted_${file.filename}`);

        // Write the IV and encrypted data to the file
        fs.writeFileSync(encryptedFilePath, Buffer.concat([iv, encrypted]));

        // Update the database record to mark the file as encrypted
        file.isEncrypted = true;
        await file.save();

        return res.status(200).json({ message: 'File encrypted successfully', encryptedFilePath });

    } catch (error) {
        console.error('Encryption Error:', error);
        return res.status(500).json({ message: 'Error encrypting file', error: error.message });
    }
};

export const decryptFile = async (req, res) => {
    try {
        const { id } = req.params;
        const { passcode } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid file ID format' });
        }
        if (!passcode) {
            return res.status(400).json({ message: 'Passcode is required' });
        }

        const file = await File.findById(id);
        if (!file || !file.isEncrypted) {
            return res.status(404).json({ message: 'Encrypted file not found' });
        }

        // Read the encrypted file
        const input = fs.createReadStream(file.filepath);
        const decryptedPath = path.join('uploads', file.filename.replace('.enc', ''));
        const output = fs.createWriteStream(decryptedPath);

        // Create decryption key from passcode
        const key = crypto.createHash('sha256').update(passcode).digest();

        let iv;

        input.on('data', (chunk) => {
            // Initialize IV on the first chunk
            if (!iv) {
                iv = chunk.slice(0, 16); // The first 16 bytes are the IV
                const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
                output.write(decipher.update(chunk.slice(16))); // Skip the IV in the first chunk
            } else {
                const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
                output.write(decipher.update(chunk));
            }
        });

        input.on('end', async () => {
            output.end(); // Close the output stream
            file.isEncrypted = false; // Mark the file as decrypted
            await file.save();
            res.download(decryptedPath, file.filename); // Send the decrypted file to the client
            console.log('File decrypted successfully', decryptedPath);
        });

        input.on('error', (error) => {
            console.error('Input Stream Error:', error);
            res.status(500).json({ message: 'Error reading encrypted file' });
        });

        output.on('error', (error) => {
            console.error('Output Stream Error:', error);
            res.status(500).json({ message: 'Error writing decrypted file' });
        });

    } catch (error) {
        console.error('Decryption Error:', error);
        res.status(500).json({ message: 'Error decrypting file' });
    }
};

export const searchFiles = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Use a regular expression to search for files
        const files = await File.find({ title: { $regex: query, $options: 'i' } });

        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'No files found' });
        }

        return res.status(200).json({
            message: 'Files retrieved successfully',
            files,
        });
      

        
    } catch (error) {
        console.log(error);
        throw new Error(error);
        
    }
}
export const addPermission = async (req, res) => {
    try {
        const { id } = req.params; // Get file ID from request parameters
        const { permissions } = req.body; // Get permissions from request body

        // Validate input
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid file ID format' });
        }
        if (!permissions || !Array.isArray(permissions)) {
            return res.status(400).json({ message: 'Permissions must be an array' });
        }

        // Find the file
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Add new permissions
        file.permissions = [...new Set([...file.permissions, ...permissions])]; // Merge and remove duplicates

        // Save the updated file
        await file.save();

        return res.status(200).json({ message: 'Permissions updated successfully', permissions: file.permissions });
        
    } catch (error) {
        console.error('Error adding permissions:', error);
        return res.status(500).json({ message: 'Error updating permissions', error: error.message });
    }
};

export const removePermission = async (req, res) => {
    try {
        const { id } = req.params; // Get file ID from request parameters
        const { permissions } = req.body; // Get permissions to remove from request body

        // Validate input
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid file ID format' });
        }
        if (!permissions || !Array.isArray(permissions)) {
            return res.status(400).json({ message: 'Permissions must be an array' });
        }

        // Find the file
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Remove specified permissions
        file.permissions = file.permissions.filter(permission => !permissions.includes(permission));

        // Save the updated file
        await file.save();

        return res.status(200).json({ message: 'Permissions removed successfully', permissions: file.permissions });
        
    } catch (error) {
        console.error('Error removing permissions:', error);
        return res.status(500).json({ message: 'Error updating permissions', error: error.message });
    }
};
export const addPasscode = (req, res) => {
    res.send('File route');
}
export const removePasscode = (req, res) => {
    res.send('File route');
}
export const getSharedFiles = async (req, res) => {
    try {
        const files = await File.find({ isShareable: true });
        
        return res.status(200).json({
            message: 'Shared files retrieved successfully.',
            files,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving shared files.', error: error.message });
    }
};

// Get all encrypted files
export const getEncryptedFiles = async (req, res) => {
    try {
        const files = await File.find({ isEncrypted: true });

        return res.status(200).json({
            message: 'Encrypted files retrieved successfully.',
            files,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving encrypted files.', error: error.message });
    }
};

// Get all shared encrypted files
export const getSharedEncryptedFiles = async (req, res) => {
    try {
        const files = await File.find({ isShareable: true, isEncrypted: true });

        return res.status(200).json({
            message: 'Shared encrypted files retrieved successfully.',
            files,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving shared encrypted files.', error: error.message });
    }
};

// Get all shared unencrypted files
export const getSharedUnencryptedFiles = async (req, res) => {
    try {
        const files = await File.find({ isShareable: true, isEncrypted: false });

        return res.status(200).json({
            message: 'Shared unencrypted files retrieved successfully.',
            files,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving shared unencrypted files.', error: error.message });
    }
};

// Get all encrypted unshared files
export const getEncryptedUnsharedFiles = async (req, res) => {
    try {
        const files = await File.find({ isShareable: false, isEncrypted: true });

        return res.status(200).json({
            message: 'Encrypted unshared files retrieved successfully.',
            files,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving encrypted unshared files.', error: error.message });
    }
};

// Get all unencrypted unshared files
export const getUnencryptedUnsharedFiles = async (req, res) => {
    try {
        const files = await File.find({ isShareable: false, isEncrypted: false });

        return res.status(200).json({
            message: 'Unencrypted unshared files retrieved successfully.',
            files,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving unencrypted unshared files.', error: error.message });
    }
};

