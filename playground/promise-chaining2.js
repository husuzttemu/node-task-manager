require('../src/db/mongoose');

const Task = require('../src/models/task');

/*
Task.findByIdAndRemove("5c816ebeaf71931c5443d466").then((task)=> {
    console.log(task);

    return Task.countDocuments({completed: false});
}).then((result) => {
    console.log("count incompleted task is :" + result);
}).catch((error) => {
    console.log(error);
});
*/
//Doing the same example with async-await

const doFindAndReplaceAndCountRecords = async(id,completed) => {
    const findByIdAndRemove = await Task.findByIdAndRemove(id);
    const countTasks = await Task.countDocuments({completed: completed});
    return countTasks;
}

doFindAndReplaceAndCountRecords("5c801fe5e2243f0a9c57f4d9",true).then((result)=> {
    console.log("Count : " ,result);
}).catch((error)=> {
    console.log("Error : ",error);
})