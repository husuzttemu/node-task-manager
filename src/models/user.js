const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//Create and use userSchema for using advantage of middleware
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (validator.contains(value.toLowerCase(),"password")){
                throw new Error("Password doesnt contain password")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value<0){
                throw new Error("age can not have a negative alue");
            }
        } 
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("email is invalid ",value);
            }

            if (value.length<6) {
                throw new Error("password should be at least 6 character");
            }
        }
    }
});

userSchema.statics.findByCredentionals = async (email,password) => {
    const user = await User.findOne({email});

    if (!user){
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return user;
}

//Hash the plain text password beforre saving
userSchema.pre('save',async function(next) {
    const user = this;

    //console.log('just before saving');
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    };
    

    next();
})

const User = mongoose.model('User',userSchema);

module.exports = User;