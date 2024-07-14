require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra')

const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

const upload = multer({ dest: 'public/' });
app.use('/public', express.static('./public'))

app.use(cors({
    origin: ['http://localhost:5173'],
    optionsSuccessStatus: 200
}));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

function protect(req, res, next) {
    const token = req.headers['token'];
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "token non valido" })
        }
        req.user = user;
        next();
    })
}

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username e password sono richiesti.' });
    }
    try {
        const query = 'SELECT * FROM user WHERE username = ?';
        db.query(query, [username], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Errore interno del server' });
            }
            if (results.length === 0) {
                return res.status(401).json({ error: 'Credenziali non valide.' });
            }
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Credenziali non valide.' });
            }
            const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '100h' });
            res.json({ message: 'Accesso consentito.', token });
        });
    } catch (err) {
        res.status(500).json({ error: 'Errore interno del server' });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username e password sono richiesti.' });
    }
    try {
        const checkUserQuery = 'SELECT * FROM user WHERE username = ?';
        db.query(checkUserQuery, [username], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Errore interno del server' });
            }
            if (results.length > 0) {
                return res.status(409).json({ error: 'Utente già presente.' });
            }
            const hash = await bcrypt.hash(password, saltRounds);
            const insertUserQuery = 'INSERT INTO user (username, password) VALUES (?, ?)';
            db.query(insertUserQuery, [username, hash], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.json({ message: 'Registrazione avvenuta con successo!', userId: result.insertId });
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use(express.json());

app.post('/api/photos', protect, upload.single('photo'), async (req, res) => {
    const file = req.file
    if (!file) return res.status(400).json({ error: 'Errore nel caricamento della foto' });

    const estensione = path.extname(file.originalname)
    const filename = `${file.filename}${estensione}`
    const photo = `http://localhost:3000/public/${filename}`

    const targetPath = path.join(__dirname, 'public', filename)

    try {
        await fs.ensureDir(path.dirname(targetPath));
        await fs.rename(file.path, targetPath);
    } catch (error) {
        return res.status(400).json({ error: 'Errore nel caricamento della foto' });
    }

    const { title, description, latitude, longitude } = req.body;
    if (!photo || !title || !description || !latitude || !longitude) {
      return res.status(400).json({ error: 'Per favore, compila tutti i campi.' });
    }
  
    if (description.length > 200) {
      return res.status(400).json({ error: 'La descrizione non può superare i 200 caratteri.' });
    }
  
    const insertQuery = `INSERT INTO photos (photo, title, description, latitude, longitude, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [photo, title, description, latitude, longitude, req.user.id];
  
    db.query(insertQuery, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Errore nel salvataggio della foto nel database' });
      }
      res.status(201).json({ message: 'Foto salvata con successo nel database' });
    });
});

app.get('/api/photos', protect, async (req, res) => {
    const selectQuery = `SELECT photo FROM photos WHERE user_id = ?`;
    db.query(selectQuery, [req.user.id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Errore nel recupero della foto nel database' });
      }
      res.status(200).json({ photos: result.map(photo => photo.photo) });
    });
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/api/images', (req, res) => {
  const directoryPath = path.join(__dirname, 'public');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory');
    }
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
    res.json(images);
  });
});

app.get('/api/photos-show-map', async (req, res) => {
    try {
      const selectQuery = `SELECT latitude, longitude FROM photos`;
      db.query(selectQuery, (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Errore nel recupero delle coordinate dal database' });
        }
        res.status(200).json(results);
      });
    } catch (err) {
      res.status(500).json({ error: 'Errore nel recupero delle coordinate dal database' });
    }

});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
