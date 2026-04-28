const fs = require('fs');
const path = require('path');

const perfumesPath = path.join(__dirname, '..', 'perfumes.json');
const perfumes = require(perfumesPath);
const publicImagesDir = path.join(__dirname, '..', 'public');

// Map of missing/problematic slugs to existing images
const IMAGE_MAPPING = {
    'elixir-of-desire': '/images/hot-stiletto.jpg',  // Red feminine bottle
    'starstruck-blooms': '/images/floral-fantasy.jpg', // Floral
    'sweet-sin': '/images/dark-candy.jpg', // Sweet/dark
    'desert-ink-copy': '/images/desert-ink-copy.jpg' // Should exist, but ensure
};

let updatedCount = 0;

const updatedPerfumes = perfumes.map(p => {
    // Check if current image exists
    const imagePath = path.join(publicImagesDir, p.imageUrl);

    if (fs.existsSync(imagePath)) {
        return p;
    }

    // If not, check if we have a mapping
    if (IMAGE_MAPPING[p.slug]) {
        console.log(`Fixing image for ${p.name} (${p.slug}): ${p.imageUrl} -> ${IMAGE_MAPPING[p.slug]}`);
        updatedCount++;
        return {
            ...p,
            imageUrl: IMAGE_MAPPING[p.slug]
        };
    }

    // Fallback for any other missing ones
    console.log(`Using fallback for ${p.name} (${p.slug}): ${p.imageUrl} -> /images/discovery-set-1.jpg`);
    updatedCount++;
    return {
        ...p,
        imageUrl: '/images/discovery-set-1.jpg'
    };
});

fs.writeFileSync(perfumesPath, JSON.stringify(updatedPerfumes, null, 2));
console.log(`\nFixed ${updatedCount} missing images in perfumes.json`);
