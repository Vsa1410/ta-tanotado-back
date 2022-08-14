const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

mongoose.connect("mongodb+srv://vsa1410:vsa141094@cluster0.wpocoqf.mongodb.net/?retryWrites=true&w=majority", {
     useNewUrlParser: true,
     useUnifiedTopology: true
     
}).then(()=> console.log("Connected to Database"))
.catch((err)=> console.log(err))