const db = require('../config/database');

class Music {
  static getAllMusic(callback) {
    const sql = 'SELECT * FROM music';
    db.query(sql, callback);
  }

  static addMusic(musicData, callback) {
    const sql = 'INSERT INTO music (title, file_path) VALUES (?, ?)';
    db.query(sql, [musicData.title, musicData.file_path], callback);
  }

  static deleteMusicById(musicId, callback) {
    const sql = 'DELETE FROM music WHERE id = ?';
    db.query(sql, [musicId], callback);
  }

}

module.exports = Music;
