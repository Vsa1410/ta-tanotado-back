var express = require('express');
var router = express.Router();
const User = require("../models/users")
const jwt = require('jsonwebtoken')
require('dotenv').config();
const secret = process.env.JWT_TOKEN;

//add new user to the database
router.post('/register', async function(req, res) {

  const {name,email,password} = req.body; //this take the information from the body
  const user = new User ({name, email,password});//this take what was passed from the body ant put on a new userSchema
  
  user.save()
  .then(() =>
    res.status(200).json(user)) 
  .catch ((err)=>{
     
     res.status(500).json({error: 'Error registering new user'})
     console.log(err)    
   } 
  )
  
});


//User login
router.post('/login', async (req, res)=>{ 
  const{email,password} = req.body;
  try {
    let user  = await User.findOne({email})
    if (!user){
      res.send(401).json({error:"Incorrect User or password"})
    }else{
      user.isCorrectPassword(password, function(err,same){
        if(!same){
          res.send(401).json({error:"Incorrect User or password"})
        }else{
          const token = jwt.sign({email},secret, {expiresIn: '10d'})
          res.json({user:user,token: token})
        }
      })
    }
    
  } catch (error) {
    res.send(500).json({error: 'Internal error, please try again later'})
    
  }
})

module.exports = router;
