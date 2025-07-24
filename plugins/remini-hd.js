// Import required modules
const fetch = require('node-fetch');
const FormData = require('form-data');
const { cmd } = require('../command');

/**
 * Uploads an image buffer to catbox.moe and returns the direct URL.
 * Catbox is a free file hosting service.
 *
 * @param {Buffer} imageBuffer - The image data to upload.
 * @returns {Promise<string>} A promise that resolves to the URL of the uploaded image.
 */
async function uploadToCatbox(imageBuffer) {
    // Create a new form data object for the POST request
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', imageBuffer, 'image.jpg'); // Append the image buffer

    // Make the request to the Catbox API
    const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form,
    });

    const responseText = await response.text();

    // The API returns a direct link on success. Check if the response is a valid URL.
    if (!responseText.startsWith('https://')) {
        throw new Error('❌ Error while uploading image to Catbox.');
    }

    return responseText.trim();
}

// Define the command details
cmd({
    pattern: 'hd',
    alias: ['remini', 'enhance'], // Changed 'test' to 'enhance' for clarity
    desc: 'Enhance photo quality using AI (like Remini)',
    category: 'tools',
    filename: __filename,
    use: '.hd (reply to an image)',
}, async (conn, mek, m, { reply }) => {

    try {
        // Send a "processing" reaction to the user
        await conn.sendMessage(mek.key.remoteJid, {
            react: { text: '⏳', key: mek.key }
        });

        // Determine if the message is a reply or a direct message with media
        const message = mek.quoted || mek;
        const mime = (message.msg || message).mimetype || message.mediaType || message.mimetype || '';

        // Validate if there is an image
        if (!mime) {
            throw '📷 Please send or reply to an image first.';
        }

        // Check if the mimetype is a supported image format
        if (!/image\/(jpe?g|png)/.test(mime)) {
            throw `❌ The format *${mime}* is not supported.`;
        }

        // Download the image buffer
        const imageBuffer = await message.download?.();
        if (!imageBuffer) {
            throw '❌ Failed to download the image.';
        }

        // 1. Upload the image to Catbox to get a direct URL
        const imageUrl = await uploadToCatbox(imageBuffer);

        // 2. Call the image enhancement API (Zenz API) with the image URL
        const reminiApiUrl = `https://zenz.biz.id/tools/remini?url=${encodeURIComponent(imageUrl)}`;
        const reminiResponse = await fetch(reminiApiUrl);

        if (!reminiResponse.ok) {
            throw '❌ Error accessing the Remini API.';
        }

        const reminiResult = await reminiResponse.json();

        // Validate the API response structure
        if (!reminiResult.status || !reminiResult.result?.result_url) {
            throw '❌ Invalid response from API.';
        }

        // 3. Fetch the final, enhanced image from the result URL
        const finalImageResponse = await fetch(reminiResult.result.result_url);
        const finalImageBuffer = await finalImageResponse.buffer();

        if (!finalImageBuffer || finalImageBuffer.length === 0) {
            throw '❌ Failed to fetch enhanced image.';
        }

        // Send the enhanced image back to the user
        await conn.sendMessage(mek.key.remoteJid, {
            image: finalImageBuffer,
            caption: '✅ *Image enhanced successfully!*',
        }, {
            quoted: mek
        });

    } catch (error) {
        // Send an error reaction and reply with the error message
        await conn.sendMessage(mek.key.remoteJid, {
            react: { text: '❌', key: mek.key }
        });

        console.error(error);
        const errorMessage = typeof error === 'string' ? error : '❌ An error occurred. Please try again later.';
        reply(errorMessage);
    }
});
