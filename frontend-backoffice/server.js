/* eslint-disable no-undef */
//Install express server
import express from 'express';
import { join } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/'));

app.get('/*', function (req, res) {
  res.sendFile(join(__dirname + '/dist/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 5173, () => {
  console.log('application en cour ..... sur le port 5173......');
});
