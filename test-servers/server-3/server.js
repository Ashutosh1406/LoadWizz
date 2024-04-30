// Import required modules
const express = require('express')

// Create an instance of express
const app = express();

// Define port
const PORT = 8012;

// Define basic routes
app.get('/', (req, res) => {

    res.status(200).json({
        success:true,
        message:'Health Check , server is running'
    })
    
});
app.get('/content', (req,res) => {
    res.status(200).json({
        success:true,
        message:'content is being served'
    })
})

app.post('/content',(req,res) => {
    res.status(200).json({
        success:true,
        message:'Post content route is being served'
    })
})
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
