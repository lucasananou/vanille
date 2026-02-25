const fs = require('fs');
const path = require('path');

const root = 'frontend/public/photos produit vanille';

function renameRecursive(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const oldPath = path.join(dir, item);
        let newName = item
            .replace(/a╠Ç/g, 'a')
            .replace(/e╠ü/g, 'e')
            .replace(/e╠üt/g, 'et')
            .replace(/L'e╠ü/g, 'Le')
            .replace(/Se╠ü/g, 'Se')
            .replace(/ /g, '-')
            .toLowerCase();

        // Remove other non-ascii if any
        newName = newName.replace(/[^\x00-\x7F]/g, '');

        const newPath = path.join(dir, newName);

        if (oldPath !== newPath) {
            console.log(`Renaming: ${oldPath} -> ${newPath}`);
            fs.renameSync(oldPath, newPath);
        }

        if (fs.statSync(newPath).isDirectory()) {
            renameRecursive(newPath);
        }
    }
}

try {
    renameRecursive(root);
    // Also rename the root if needed
    const newRoot = root.replace(/ /g, '-').toLowerCase();
    if (root !== newRoot) {
        console.log(`Renaming root: ${root} -> ${newRoot}`);
        fs.renameSync(root, newRoot);
    }
} catch (e) {
    console.error(e);
}
