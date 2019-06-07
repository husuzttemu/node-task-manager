const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Task = require('./task')


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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]  
},
{
    timestamps: true
});


userSchema.virtual('tasks', {
    ref: 'tasks',
    localField: '_id',
    foreignField: 'owner'
});

//userSchema.methods.getPublicProfile = function()  {
userSchema.methods.toJSON = function()  {
    const user = this
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign( {_id: user._id.toString()}, 'ilearnnodejs', {expiresIn: '7 days'});

    user.tokens = user.tokens.concat({  token })
    await user.save();
    return token;
}

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

userSchema.pre('remove',async function(next){
    const user = this;

    await Task.deleteMany({owner: user._id});


    next();
})

const User = mongoose.model('User',userSchema);

module.exports = User;