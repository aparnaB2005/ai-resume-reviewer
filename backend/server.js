const express= require('express');
const mongoose = require('mongoose');
const cors =require('cors');

require('dotenv').config();


const app=express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'ai-resume-reviewer-app-sigma.vercel.app'  // add your vercel URL here
  ]
}));
app.use(express.json());

app.use('/api/auth',require('./routes/auth'));
app.use('/api/review',require('./routes/review'));

app.get('/',(req,res) => res.send('API is running...'));


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
   .then(()=>{
    console.log('MongoDB connected');
    app.listen(PORT,()=>{
        console.log(`Server running on ${PORT}`);
    })
      })
    .catch(err =>{
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
  
   });