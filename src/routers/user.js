const express = require('express');

const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');

/*
router.get('/test',(req,res) => {
    res.send('from a new file')
});*/

router.post('/users', async(req,res)=> {

    const user = new User(req.body);
    //const token = jwt.sign({_id: user._id.toString()} , 'ilearnnodejs', {expiresIn: '7 days'});
    
    //console.log(token);
    //user.tokens = user.tokens.concat({ token });

    try{
        const token = await user.generateAuthToken();
        await user.save();
        
        res.status(201).send({user,token});
    }catch(e){
        res.status(400).send(e);
    }

});

router.post('/users/login',async (req,res)=> {
    try{
        const user = await User.findByCredentionals(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        //res.send({user: user.getPublicProfile(),token});
        res.send({user, token});
    }
    catch(error){
        res.status(400).send(error);
    }
})

router.post('/users/logout',auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter( (token) => {
            
            return token.token !== req.token
        })
        console.log(req.user.tokens);
        await req.user.save();
        res.send()
    }
    catch(error){
        res.status(500).send(error);
    }
})

const uploadAvatar = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        console.log(file.originalname);
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload a word document!'));
        }
        cb(undefined,true);
        //cb(null, false)
        // To accept the file pass `true`, like so:
        //cb(null, true)
        // You can always pass an error if something goes wrong:
        //cb(new Error('I don\'t have a clue!'))
    }
});


router.post('/users/me/avatar', uploadAvatar.single('avatar'), async (req,res) => {
    res.send();
})

router.post('/users/logoutall', auth, async (req,res) => {
    try{
        
        req.user.tokens = []
        await req.user.save();
        res.send()
    }
    catch(error){
        res.status(500).send(error);
    }
})

/* before adding middleware
router.get('/users',async (req,res)=> {
    //User.find({}).then((users) => {
      //  res.status(200).send(users);

    //}).catch((error)=> {
      //  res.status(500).send(error);
    //})
    try{
        const users = await User.find({});
        res.status(200).send(users);
    }
    catch(e){
        res.status(500).send(e);
    }
    
});*/

//after adding middleware


router.get('/users/me', auth, async (req,res)=> {

    res.send(req.user);
    
});

router.get('/users', auth, async (req,res)=> {
    //User.find({}).then((users) => {
      //  res.status(200).send(users);

    //}).catch((error)=> {
      //  res.status(500).send(error);
    //})
    try{
        const users = await User.find({});
        res.status(200).send(users);
    }
    catch(e){
        res.status(500).send(e);
    }
    
});


router.get('/users/:id',async (req,res)=> {
    const _id = req.params.id;

    /*User.findById({_id}).then((user) => {
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);

    }).catch((error)=> {
        res.status(500).send(error);
    })*/
    try{
        const user = await User.findById({_id});
        if (!user)
        {
            return res.status(404).send();
        }
        res.status(201).send(user);
    }
    catch(e){
        res.status(500).send(e);
    }
    
});

/* we change patch endpoint
router.patch('/users/:id', async(req,res)=> {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name","email","password","age"];

    const isValidOperation = updates.every((update)=> {
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send({error : "Invalid updates!"});
    }

    try{
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
        const user = await User.findById(req.params.id);
        updates.forEach((update) => {
            user[update] = req.body[update];
        })

        await user.save();

        if (!user){
            return res.status(404).send("user is not exists");
        }

        res.status(200).send(user);
    }
    catch(error){
        res.status(400).send(error);
    }
})
*/
/*
router.delete('/users/:id',async (req,res)=> {
    
    try{

        const user = await User.findByIdAndDelete(req.params.id);

        if(!user){
            return res.status(404).send("user is not exist!");
        }

        res.status(200).send(user);
    }
    catch(error) {
        res.status(500).send(error);
    }
});
*/

router.patch('/users/me', auth, async(req,res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ["name","email","password","age"];

    const isValidOperation = updates.every((update)=> {
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send({error : "Invalid updates!"});
    }

    try{
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        })

        await req.user.save();


        res.status(200).send(req.user);
    }
    catch(error){
        res.status(400).send(error);
    }
})
router.delete('/users/me', auth, async (req,res)=> {
    
    try{

        await req.user.remove();

        res.status(200).send(req.user);
    }
    catch(error) {
        res.status(500).send(error);
    }
});



module.exports = router;

