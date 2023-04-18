const express = require('express')
const morgan = require('morgan')
const dotenv=require('dotenv');

const routes =require('./Routes/route')
const mongoose=require('mongoose')


//configure env
dotenv.config();

//rest object
const app =express()

//middlewares
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/',routes)


//Data base Configuration
const connectDB =  async ()=>{
   
  try{
      const conn = await mongoose.connect(process.env.MONGO_URI,{  
          useNewUrlParser: true,
      })
      console.log(`mongo database is connected!!! ${conn.connection.host} `)
  }catch(error){
      console.error(`Error: ${error} `)
  }

}

connectDB()

//Server Port Configuration
const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(
        `Server Running on port ${PORT}`
      );
})