import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2';
import { encrypt, decrypt } from './handleEncryption.js';

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'n4R$qMRVC#3!oo3cRQfW',
  database: 'passwordmanager',
});

app.post('/addpassword', (req, res) => {
  const { title, password } = req.body;
  const hashedPassword = encrypt(password);

  let SQL = 'INSERT INTO passwords (title, password, iv) VALUES (?, ?, ?)';
  db.query(
    SQL,
    [title, hashedPassword.password, hashedPassword.iv],
    (err, result) => {
      if (err) console.log(err);
      else console.log(result);
    }
  );
});

app.get('/showpasswords', (req, res) => {
  let SQL = 'SELECT * FROM passwords';
  db.query(SQL, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

app.post('/decryptpassword', (req, res) => {
  res.send(decrypt(req.body));
});

app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
