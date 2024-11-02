import express from 'express';
const router = express.Router();
import { getFiles, postFile, getOneFile, deleteFile, updateFile, downloadFile, shareFile, unshareFile, encryptFile, decryptFile, searchFiles, addPermission, removePermission, getSharedFiles, getEncryptedFiles, getSharedEncryptedFiles, getSharedUnencryptedFiles, getEncryptedUnsharedFiles, getUnencryptedUnsharedFiles } from '../controllers/file.controller.js';
import { upload } from '../helpers/multer.js';

router.get('/', getFiles);
router.post('/post', upload.single('file'), postFile);
router.get('/getOneFile/:id', getOneFile);
router.delete("/deleteFile/:id", deleteFile);
router.put("/updateFile/:id", updateFile);
router.get('/download/:id', downloadFile);
router.get('/shareFile/:id', shareFile);
router.get('/unshareFile/:id', unshareFile);
router.get('/encryptFile/:id', encryptFile);
router.post('/decryptFile/:id', decryptFile);
router.get('/search', searchFiles);
router.get('/addPermission/:id', addPermission);
router.get('/removePermission/:id', removePermission);
router.get('/files/shared', getSharedFiles);
router.get('/files/encrypted', getEncryptedFiles);
router.get('/files/shared/encrypted', getSharedEncryptedFiles);
router.get('/files/shared/unencrypted', getSharedUnencryptedFiles);
router.get('/files/encrypted/unshared', getEncryptedUnsharedFiles);
router.get('/files/unencrypted/unshared', getUnencryptedUnsharedFiles);










export { router };