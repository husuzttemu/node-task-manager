const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';
const ObjectID = mongodb.ObjectID;

//const id = new ObjectID();
//console.log(id);

MongoClient.connect(connectionURL,{ useNewUrlParser: true } ,(error,client)=> {
    if (error) {
        return console.log('Unable to connect to database');
    }

    //console.log('Connected correctly');

    const db = client.db(databaseName);
 /*
    db.collection('users').insertOne({
        "_id": new ObjectID(),
        "name": "Fatma",
        "age": 64
    }, (error,result) => {
        if (error) {
            return console.log('Unable to insert record');
        }

        console.log(result.ops);
    });


    db.collection('users').insertMany(
        [{"name": "Meral",
        "age": 40},
        {
            "name": "Ahmet Ömer",
            "age": 76}]
            , (error,result) => {
        if (error) {
            return console.log('Unable to insert record');
        }

        console.log(result.ops);
    });
    */

    /*
    db.collection('tasks')
    .insertMany([
        {
            "description": "reading 1984",
            "completed": false
        },
        {
            "description": "watching Hobbit I",
            "completed": true
        },
        {
            "description": "playing tennis at the weekend",
            "completed": false
        }
        ],(error,result) => {
            if (error) {
                return console.log('unable to insert record into tasks',error);
            }

            console.log(JSON.stringify(result.ops,undefined,2));
        });
        */
       /*
        db.collection('users').find({}).toArray((error,result)=> {
            if (error) {
                return console.log('unable to select records',error);
            }

            console.log(JSON.stringify(result,undefined,2));
        });

        db.collection('tasks').find({"completed": false}).toArray((error,result) => {
            if (error) {
                return console.log('an error occuredd:',error);
            }

            console.log(JSON.stringify(result,undefined,2));
            
        });
        */
/*
        db.collection('users').updateOne({
            _id: new ObjectID('5c7c3cc6debdfc0ed84c813a')
        }, {
            $set: {
                name: "Mike"
            }
        }).then( (result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        });
        */

        db.collection('users')
        .deleteOne({name: "Meral"})
        .then((result)=> {
            console.log(result);
        })
        .catch((error)=> {
            console.log("couldnt delete record:",error);
        });
        


});
