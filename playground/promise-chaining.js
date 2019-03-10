require('../src/db/mongoose')

const User = require('../src/models/user');

/*
User.findByIdAndUpdate("5c803edfd1e21a1998f21b67",{age: 5}).then((user) => {
    console.log(user);
    
    return User.countDocuments({age: 5 });
}).then((result)=> {
    console.log(result);
}).catch((error) => {
    console.log(error);
})*/

const findAndUpdateAndCount = async(id,age) => {
    const user = await User.findByIdAndUpdate(id, {age: age});
    const count = await User.countDocuments({ age })
    return count;
}

findAndUpdateAndCount("5c7ee12869ee151a6489c7cd",46).then((result) => {
    console.log("count record : ",result);
}).catch((error) => {
    console.log("error : ",error);
})