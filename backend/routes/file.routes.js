import express from 'express';
const router = express.Router();
import { getFiles, postFile, getOneFile, deleteFile, updateFile, downloadFile, shareFile, unshareFile, encryptFile, decryptFile, searchFiles, addPermission, removePermission, getSharedFiles, getEncryptedFiles, getSharedEncryptedFiles, getSharedUnencryptedFiles, getEncryptedUnsharedFiles, getUnencryptedUnsharedFiles } from '../controllers/file.controller.js';
import { upload } from '../helpers/multer.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { File } from '../models/file.models.js';

import bcrypt from 'bcrypt';
router.get('/', authMiddleware, getFiles);
router.post('/post',  authMiddleware ,  upload.single('filename'), postFile);
router.get('/getOneFile/:id' , getOneFile);
router.get("/search/:name" , searchFiles);
router.delete("/deleteFile/:id", deleteFile);
router.put("/updateFile/:id", updateFile);
router.get('/download/:id', downloadFile);
router.get('/shareFile/:id', shareFile);
router.get('/unshareFile/:id', unshareFile);
router.get('/encryptFile/:id', encryptFile);
router.post('/decryptFile/:id', decryptFile);
router.get('/addPermission/:id', addPermission);
router.get('/removePermission/:id', removePermission);
router.get('/files/shared', getSharedFiles);
router.get('/files/encrypted', getEncryptedFiles);
router.get('/files/shared/encrypted', getSharedEncryptedFiles);
router.get('/files/shared/unencrypted', getSharedUnencryptedFiles);
router.get('/files/encrypted/unshared', getEncryptedUnsharedFiles);
router.get('/files/unencrypted/unshared', getUnencryptedUnsharedFiles);
router.post('/validate/:id', async (req, res) => {
    const { id } = req.params;
    const { passcode } = req.body;

    if (!passcode) {
        return res.status(400).json({ message: 'Passcode is required.' });
    }

    try {
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found.' });
        }

        // Check if the file is encrypted
        if (file.isEncrypted) {
            const storedHashedPasscode = file.passcode; // Ensure this is the correct field

            // Check if the hashed passcode exists
            if (!storedHashedPasscode) {
                return res.status(404).json({ message: 'Hashed passcode not found.' });
            }

            // Validate the passcode
            const isMatch = await bcrypt.compare(passcode, storedHashedPasscode);
            return res.status(200).json({ isValid: isMatch });
        } else {
            return res.status(200).json({ isValid: true });
        }
    } catch (error) {
        console.error('Error validating passcode:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});


router.post('/verify-passcode', async (req, res) => {
    try {
        const { fileId, passcode } = req.body;

        // Validate inputs
        if (!fileId || !passcode) {
            return res.status(400).json({ message: 'File ID and passcode are required' });
        }

        // Find file in the database
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check if the file has a hashed passcode
        if (!file.isEncrypted) {
            return res.status(400).json({ message: 'This file is not encrypted' });
        }

        // Compare passcode using bcrypt
        const isMatch = await bcrypt.compare(passcode, file.passcode);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect passcode' });
        }

        // Success: Send file ID for redirection
        return res.status(200).json({ message: 'Passcode correct', fileId: file._id });
    } catch (error) {
        console.error('Error verifying passcode:', error);
        res.status(500).json({ message: 'Server error' });
    }
});






export { router };