const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(fileUpload());
app.use(express.json());

// Serve data.json
app.get('/data', (req, res) => {
  const dataPath = path.join(__dirname, './src/data/data.json');
  const data = fs.readFileSync(dataPath, 'utf-8');
  res.json(JSON.parse(data));
});

// Save data.json
app.post('/save-data', (req, res) => {
  const dataPath = path.join(__dirname, './src/data/data.json');
  fs.writeFileSync(dataPath, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

// File upload
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.image;
  const uploadPath = path.join(__dirname, './src/data/data.json', file.name);

  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ success: true, filePath: `/uploads/${file.name}` });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
