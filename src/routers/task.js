const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();


router.post('/tasks', auth, async (req,res)=> {
    //const task = new Task(req.body);
    /*task.save().then(()=> {
        res.status(201).send(task);
    }).catch((error) => {
        res.status(404).send(error);
    });*/
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save();
        res.status(201).send(task);
    }
    catch(error){
        res.status(404).send(error);
    }
});


router.get('/tasks', auth, async (req,res)=> {
    /*Task.find({}).then((tasks)=> {
        res.status(200).send(tasks);
    }).catch((error) => {
        res.status(404).send(error);
    })*/

    const match = {}

    if (req.query.completed){
        match.completed = req.query.completed === 'true';
    }

    const sort = {}

    if (req.query.sortBy){
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    

    try{
        //const tasks = await Task.find({owner: req.user._id});

        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt( req.query.skip),
                sort
            }
        }).execPopulate();
        res.status(201).send(req.user.tasks);
    }
    catch(error){
        res.status(404).send(error);
    }

});

router.get('/tasks/:id',auth ,async (req,res)=> {
    const _id = req.params.id;
    /*Task.findById(id).then((task)=> {
        if (!task) {
            return res.status(404).send("we couldnt find the record by id : " + id);
        }
        res.status(200).send(task);
    }).catch((error)=> {
        res.status(500).send(error);
    })*/

    try{
        //const task = await Task.findById(_id);
        const task = await Task.findOne({_id, owner: req.user._id})
        //console.log("id",_id);
        //console.log(req.user._id);
        if (!task){
            return res.status(404).send("we couldnt find the record by id : " + id);
        }
        res.status(200).send(task);
    }
    catch(error){
        res.status(404).send(error);
    }
    

})


router.patch('/tasks/:id', auth, async(req,res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ["description","completed"];
    const isValidOperation = updates.every((update)=> {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation){
        return res.status(400).send({error : "Invalid updates!"});
    }


    try{
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body,{ new: true, runValidators: true});
        //const task = await Task.findById(req.params.id);
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id  })
        
        updates.forEach((update)=> {
            task[update] = req.body[update];
        });

        await task.save();

        if (!task){
            return res.status(404).send("task is not exists");
        }

        res.status(200).send(task);

    }
    catch(error){
        res.status(400).send(error);
    }
});


router.delete('/tasks/:id',auth, async (req,res)=> {
    try{
        //const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});

        if (!task){
            return res.ştatus(404).send('task is not exist!');
        }

        res.status(200).send(task);

    }
    catch(error){
        res.status(500).send(error);
    }
})

module.exports = router;