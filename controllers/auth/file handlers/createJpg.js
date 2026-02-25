import fs from 'fs';


async function saveBase64ToJpg(base64String1, base64String2) {
    try {
        // Remove header from base64 string
        const base64Data1 = base64String1.replace(/^data:image\/\w+;base64,/, '');
        const base64Data2 = base64String2.replace(/^data:image\/\w+;base64,/, '');

        // Create directory if it doesn't exist
        if (!fs.existsSync('photos')) {
            fs.mkdirSync('photos');
        }

        // Convert base64 to buffer
        const buffer1 = Buffer.from(base64Data1, 'base64');
        const buffer2 = Buffer.from(base64Data2, 'base64');

        // Write buffer to file
        fs.writeFileSync(`photos/ref.jpg`, buffer1);
        fs.writeFileSync(`photos/test.jpg`, buffer2);
    } catch (error) {
        console.error('Error saving file:', error);
    }
}

export default saveBase64ToJpg;
