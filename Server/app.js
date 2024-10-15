require('dotenv').config();
const express = require('express');
const cors =require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const sequelize = require('./database/db.js'); // import the db connection 

const app = express(); // create an instance of Express

// Middleware setup
app.use(express.urlencoded({extended:true})); // To parse URL-encoded data
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser());

//Enable CORS
app.use(cors({
  origin:'http://localhost:5173', 
  credentials: true 

}));

// Handle preflight requests
app.options('*', cors());



// Test route
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

// Use all routes from routes.js
app.use('/', routes); // it will apply all the routes defined in routes.js

// Handle 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
      status: 'fail',
      message: 'Route not found'
  });
});


// Connect to the database and sync models
sequelize.initializeDatabase()
    .then(() => {
        console.log('Database connected...');
        return sequelize.sync(); // Syncs the models with the database
    })
    .then(() => {
        // Start the server after successful DB connection
        const PORT = process.env.APP_PORT || 3000; // Define the port number
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });


// Call the function to initialize the database connection
initializeDatabase();




app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${port}`)
})

