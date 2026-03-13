import express from 'express';
import * as path from 'path';

const app = express();

app.use(express.static(path.resolve(__dirname, 'dist')));

app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

app.listen(80, () => { });

// eslint-disable-next-line no-console
console.log('Server started successfully.');
