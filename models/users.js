const mongoose  = require('mongoose')
const bcrypt = require('bcrypt')

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true,
    },
    created_at:{
            type: Date,
            default: Date.now
        },
    updated_at: {
            type: Date, 
            default: Date.now
        }
    

})

userSchema.pre('save', async function(next){
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(this.password,salt)
        this.password = hashedpassword
        next()
    } catch (error) {
     next(error)   
    }
})

userSchema.methods.isCorrectPassword = async function (password,callback) {
    bcrypt.compare(password, this.password, function(err, same){
        if (err){
            callback(err)
        }else{
            callback(err,same);
        }
    })
}
module.exports = mongoose.model('User', userSchema)