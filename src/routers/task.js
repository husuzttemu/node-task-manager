const express = require('express');
const Task = require('../models/task');

const router = new express.Router();


router.post('/tasks',async (req,res)=> {
    const task = new Task(req.body);
    /*task.save().then(()=> {
        res.status(201).send(task);
    }).catch((error) => {
        res.status(404).send(error);
    });*/
    try{
        await task.save();
        res.status(201).send(task);
    }
    catch(error){
        res.status(404).send(error);
    }
});

router.get('/tasks',async (req,res)=> {
    /*Task.find({}).then((tasks)=> {
        res.status(200).send(tasks);
    }).catch((error) => {
        res.status(404).send(error);
    })*/
    try{
        const tasks = await Task.find({});
        res.status(201).send(tasks);
    }
    catch(error){
        res.status(404).send(error);
    }

});

router.get('/tasks/:id',async (req,res)=> {
    const id = req.params.id;
    /*Task.findById(id).then((task)=> {
        if (!task) {
            return res.status(404).send("we couldnt find the record by id : " + id);
        }
        res.status(200).send(task);
    }).catch((error)=> {
        res.status(500).send(error);
    })*/

    try{
        const task = await Task.findById(id);
        if (!task){
            return res.status(404).send("we couldnt find the record by id : " + id);
        }
        res.status(200).send(task);
    }
    catch(error){
        res.status(404).send(error);
    }
    

})


router.patch('/tasks/:id', async(req,res) => {

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
        const task = await Task.findById(req.params.id);
        
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


router.delete('/tasks/:id',async (req,res)=> {
    try{
        const task = await Task.findByIdAndDelete(req.params.id);

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