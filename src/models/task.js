const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if (value.length<5) {
                throw new Error("description should have more than 5 character");
            }

        }
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
{
    timestamps: true
});

const Task = mongoose.model('tasks',taskSchema);

module.exports = Task;