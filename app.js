const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer'); // For handling file uploads
const db = require('./config/database');
const routes = require('./routes/music_routes');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files like CSS and JS
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Multer storage configuration for saving uploaded music files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Save to 'public/uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  }
});

const upload = multer({ storage: storage });

// Routes - pass multer middleware for upload route
app.use('/', routes);

app.post('/upload', upload.single('musicFile'), (req, res) => {
  // Logic to handle file upload and save to the database
  const { title } = req.body;
  const filePath = `/uploads/${req.file.filename}`;

  const sql = 'INSERT INTO music (title, file_path) VALUES (?, ?)';
  db.query(sql, [title, filePath], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Error handling for 404 - Page Not Found
app.use((req, res, next) => {
  res.status(404).render('404', { message: 'Page not found' });
});

// Server Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
