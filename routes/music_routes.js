const express = require('express');
const router = express.Router();
const musicController = require('../controllers/music_Controller');

router.get('/', musicController.getIndexPage);
router.get('/upload', musicController.getUploadPage);
router.get('/library', musicController.getLibraryPage);
router.post('/create-playlist', musicController.createPlaylist);
router.post('/add-to-playlist', musicController.addToPlaylist);
router.post('/delete-music', musicController.deleteMusic); 
router.post('/delete-music-from-playlist', musicController.deleteMusicFromPlaylist); 
router.get('/playlist/:id', musicController.viewPlaylist);

module.exports = router;
