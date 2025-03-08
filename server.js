const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Store for couple spaces
const coupleSpaces = {};

// Create a new couple space
app.post('/api/create-space', (req, res) => {
    const spaceId = uuidv4();
    coupleSpaces[spaceId] = {
        created: new Date(),
        lastAccessed: new Date()
    };
    
    res.json({ 
        success: true, 
        spaceId: spaceId,
        url: `${req.protocol}://${req.get('host')}/space/${spaceId}`
    });
});

// Serve the app for a specific space
app.get('/space/:spaceId', (req, res) => {
    const { spaceId } = req.params;
    
    // Check if space exists
    if (!coupleSpaces[spaceId]) {
        return res.status(404).send('Space not found');
    }
    
    // Update last accessed time
    coupleSpaces[spaceId].lastAccessed = new Date();
    
    // Serve the app with the space ID embedded
    const appHtml = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
    const modifiedHtml = appHtml.replace('</head>', 
        `<script>const SPACE_ID = "${spaceId}";</script></head>`);
    
    res.send(modifiedHtml);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 