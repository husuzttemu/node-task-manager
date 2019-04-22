const express = require('express')
require('./db/mongoose')
const User = require('./models/user');
const Task = require('./models/task.js');

const app = express();
const port = process.env.PORT || 3000;

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const bcrypt = require('bcryptjs');

/* //Middleware exmple
app.use((req, res, next)=> {
    //console.log(req.method, req.path);
    //next();

    if (req.method === 'GET'){
        res.send('GET requests are disabled');
    } else {
        next();
    }
})*/

//Set the middleware
/*
app.use( (req, res, next) => {
    res.status(503).send('Cant ' + req.method + ' requests!');
})*/


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//
// Without middleware : new request -->   run route handler
//
// With middleware    : new request -->   do something    -->  run route handler
//

/*
app.post('/users',(req,res) => {
    //console.log(req.body);
    const user = new User(req.body);
    user.save().then(()=> {
        res.status(201).send(user);
    }).catch((error)=> {
        res.status(400).send(error);
    });
    //res.send('testing');
});*/



app.listen(port,() => {
    console.log("Server is up on port " + port);
});

const main = async () => {
    //const task = await Task.findById('5cb4d79b17f6480b1891984b');
    //await task.populate('owner').execPopulate();
    //console.log(task.owner);

    const user = await User.findById('5cb4d6159feadc09c07fd278');
    //console.log(user);
    await user.populate('tasks').execPopulate();
    //console.log(user.tasks);
}

main();

const jwt = require('jsonwebtoken');



const myFunction = async () => {
    /*
    const password = "123456";
    const hashPassword = await bcrypt.hash(password,8);

    console.log(password);
    console.log(hashPassword);

    const isMatch = await bcrypt.compare("12345",hashPassword);
    console.log(isMatch);*/
    const token = jwt.sign({_id: 'abcd12'}, 'ilearnnodejs', {expiresIn: '7 days'});
    //console.log(token);
    const data = jwt.verify(token,'ilearnnodejs')
    //console.log("data",data);
}

myFunction();


