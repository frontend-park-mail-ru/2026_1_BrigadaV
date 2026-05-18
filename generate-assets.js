import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

function walkDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walkDir(filePath, fileList);
        } else {
            const webPath = filePath.replace(publicDir, '').replace(/\\/g, '/');
            if (webPath !== '/sw.js') {
                fileList.push(webPath);
            }
        }
    });
    return fileList;
}

const assets = walkDir(publicDir);
fs.writeFileSync('public/assets-manifest.json', JSON.stringify(assets, null, 2));
