const fs = require('fs');
const path = require('path');

const perfumes = require('../perfumes.json');
const imagesDir = path.join(__dirname, '..', 'public', 'images');

const existingImages = fs.readdirSync(imagesDir);
console.log('Existing images:', existingImages.length);

const missing = [];
for (const p of perfumes) {
    const imagePath = path.join(__dirname, '..', 'public', p.imageUrl);
    if (!fs.existsSync(imagePath)) {
        missing.push({ name: p.name, imageUrl: p.imageUrl, slug: p.slug });
    }
}

console.log('\nMissing images:', missing.length);
missing.forEach(m => console.log(`${m.name}: ${m.imageUrl}`));

console.log('\nAvailable images:');
existingImages.forEach(img => console.log(img));
