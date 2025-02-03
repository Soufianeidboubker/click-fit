const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'upload_images');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log(`Created upload directory: ${uploadDir}`);
        }
        
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload Endpoint with enhanced logging
app.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            console.error('No file received in upload request');
            return res.status(400).json({ 
                success: false,
                error: 'No file uploaded or invalid file type' 
            });
        }

        console.log('Successfully uploaded file:', {
            originalName: req.file.originalname,
            savedAs: req.file.filename,
            path: req.file.path,
            size: `${(req.file.size / 1024).toFixed(2)} KB`
        });

        res.json({
            success: true,
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during file upload'
        });
    }
});

// Static Files Serving
app.use('/uploads', express.static(path.join(__dirname, 'upload_images')));
app.use(express.static(path.join(__dirname, '../frontend')));

// Handle all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\nServer running on http://localhost:${PORT}`);
    console.log(`Upload directory: ${path.join(__dirname, 'upload_images')}`);
    console.log(`Serving frontend from: ${path.join(__dirname, '../frontend')}\n`);
});