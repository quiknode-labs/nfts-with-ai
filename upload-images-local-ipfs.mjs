import fs from 'fs';
import { create } from 'kubo-rpc-client';

// connect to ipfs daemon API server
const ipfs = create('http://127.0.0.1:5001');

async function uploadToIPFS(filePath) {

    try {
	    const response = await ipfs.add(fs.createReadStream(filePath));

        return response;
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        throw error;
    }
}

function createNFTMetadata(filePath, imageUrl) {
    const name = 'NFT name';
    const description = 'NFT description';
    const metadata = {
        name,
        description,
        image: imageUrl,
        attributes: [] // Add any additional attributes here
    };
    fs.writeFileSync(filePath, JSON.stringify(metadata));
}

async function main() {

    try {
        for (let i = 0; i < 5; i++) {
            const imageName = `image_${i}.png`;
            const imagePath = `./${imageName}`;

            // Upload image
            const imageUploadResponse = await uploadToIPFS(imagePath);
            console.log('Image uploaded:', imageUploadResponse);

            // Create metadata
            const imageUrl = `https://ipfs.io/ipfs/${imageUploadResponse.cid}`;
            const metadataFile = `metadata_${i}.json`;
            const metadataPath = `./${metadataFile}`;
            createNFTMetadata(metadataPath, imageUrl);

            // Upload metadata
            const metadataUploadResponse = await uploadToIPFS(metadataPath);
            console.log('Metadata uploaded:', metadataUploadResponse);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
