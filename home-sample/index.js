import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = 3000;
app.listen(process.env.PORT || port, () => {
  console.log(
    `Start Server, visit http://localhost:${process.env.PORT || port}`
  );
});
