
const multer = require('multer');


const IMAGE_TYPE = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg'
};


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = IMAGE_TYPE[file.mimetype];
        let error = new Error('Invalid File type');
        if (isValid) {
            error = null;
        }
        cb(error, './images');
    },
    filename: (req,file,cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('_');
        const ext = IMAGE_TYPE[file.mimetype];
        cb(null, name + Date.now() + ext);
    }
});

module.exports = multer({ storage: storage }).single('image');