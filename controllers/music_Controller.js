const db = require('../config/database');

exports.getIndexPage = (req, res) => {
  const musicSql = 'SELECT * FROM music';
  const playlistsSql = 'SELECT * FROM playlists';

  db.query(musicSql, (err, musicResults) => {
    if (err) throw err;

    db.query(playlistsSql, (err, playlistResults) => {
      if (err) throw err;
      res.render('index', { musicList: musicResults, playlists: playlistResults });
    });
  });
};

exports.getUploadPage = (req, res) => {
  res.render('upload');
};

exports.getLibraryPage = (req, res) => {
  const sql = 'SELECT * FROM playlists';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('library', { playlists: results });
  });
};

// Create Playlist
exports.createPlaylist = (req, res) => {
  const { playlistName } = req.body;
  const sql = 'INSERT INTO playlists (name, user_id) VALUES (?, ?)'; // Change 1 to the actual user_id if needed
  db.query(sql, [playlistName, 1], (err) => {
    if (err) throw err;
    res.redirect('/library');
  });
};

// Add Music to Playlist
exports.addToPlaylist = (req, res) => {
  const { musicId, playlistId } = req.body;
  const sql = 'INSERT INTO playlist_music (playlist_id, music_id) VALUES (?, ?)';
  db.query(sql, [playlistId, musicId], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
};

// View Playlist
exports.viewPlaylist = (req, res) => {
  const playlistId = req.params.id;

  // Fetch the playlist information
  const playlistSql = 'SELECT * FROM playlists WHERE id = ?';
  db.query(playlistSql, [playlistId], (err, playlistResults) => {
    if (err) throw err;

    // Check if the playlist exists
    if (playlistResults.length === 0) {
      return res.status(404).send('Playlist not found'); // Handle if playlist not found
    }

    const playlist = playlistResults[0]; // Get the first (and only) result
    const sql = `
      SELECT music.* 
      FROM music 
      JOIN playlist_music ON music.id = playlist_music.music_id 
      WHERE playlist_music.playlist_id = ?
    `;

    db.query(sql, [playlistId], (err, musicResults) => {
      if (err) throw err;
      res.render('playlist', { playlist, musicList: musicResults });
    });
  });
};

// Delete Music (from the main music list)
exports.deleteMusic = (req, res) => {
    const musicId = req.body.musicId; // Get the music ID from the request body
  
    // First, delete the music from the playlist_music table (if associated with any playlist)
    const deleteFromPlaylistSql = 'DELETE FROM playlist_music WHERE music_id = ?';
    
    db.query(deleteFromPlaylistSql, [musicId], (err) => {
      if (err) throw err;
      
      // Then delete the music from the music table
      const sql = 'DELETE FROM music WHERE id = ?'; // SQL to delete music
      db.query(sql, [musicId], (err) => {
        if (err) throw err;
        res.send({ message: 'Music deleted successfully' }); // Send a success response
      });
    });
  };
  
  // Remove Music from Playlist (but not from the main music list)
  exports.deleteMusicFromPlaylist = (req, res) => {
    const { musicId, playlistId } = req.body; // Get musicId and playlistId from the request body
  
    // SQL to remove the music from the playlist
    const sql = 'DELETE FROM playlist_music WHERE music_id = ? AND playlist_id = ?';
    
    db.query(sql, [musicId, playlistId], (err) => {
      if (err) throw err;
      res.redirect(`/playlist/${playlistId}`); // Redirect back to the playlist page
    });
  };

  
  
