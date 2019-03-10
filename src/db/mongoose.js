

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

/*
const me = new User({
    name: " Hüseyin UZTETİK  ",
    password: " passwrdx  ",
    age: 69,
    email: "HUSEYINUZTETIK@cAAA.com"
});
*/

/*
me.save().then(()=> {
    console.log(me);
}).catch((error) => {
    console.log("error : ",error)
});
*/



/*
const myTask = new Task({
    description: " writing a poemr"
});

myTask.save().then(()=> {
    console.log(myTask);
}).catch((error)=> {
    console.log("error on task : ",error);
});
*/

