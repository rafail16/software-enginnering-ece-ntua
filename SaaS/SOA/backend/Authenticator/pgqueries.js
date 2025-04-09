const Pool = require('pg').Pool
const  request = require('request');

const getUsers = (req ,res) => {
    const requestOptions = {
        url: "http://localhost:3000/user",
        method: 'GET',
        json: {}
    }
    request(requestOptions, (err, response, body) =>
    {
        if (err) {
            console.log(err);
        } else if (response.statusCode === 200) {
            res.json(body);  //Return object
        } else {
            console.log(response.statusCode);
        }
    });
}

const getUserByUsername = (req,res) => {
    const username = req.body.username;
    if (!username) {
        res.json({"error":"No proper username given"});
    }
    else {
        const requestOptions = {
            url: "http://localhost:3000/user",
            method: 'GET',
            json: {}
        }
        request(requestOptions, (err, response, body) =>
        {
            if (err) {
                console.log(err);
            } else if (response.statusCode === 200) {
                for(x in body) {
                    if (body[x].username == username)
                        res.json(body[x]);
                }
            } else {
                console.log(response.statusCode);
            }
        });
    }
}

const createUser = (req ,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        response.status(400).send("Error Inserting username or password");
    }
    else {
        let customobject = {};
        customobject.username=username;
        customobject.password=password;
        const requestOptions = {
            url: "http://localhost:3000/user",
            method: 'POST',
            json: customobject
        }
        request(requestOptions, (err, response, body) =>
        {
            if (err) {
                console.log(err);
            } else if (response.statusCode === 201) {
                res.status(210).json({"Status":"OK"});
                //res.json(body);  //Return object
            } else {
                res.status(400).send("An error was Encountered,check again");
                console.log(response.statusCode);
            }
        });
    }
}

//TO DO updateUser + DeleteUser


/*const updateUser = (req ,res) => {

    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        response.status(400).send("Error Inserting username or password");
    }
    else {
        let miniobject={};
        let temp=[];

        const requestOptions1 = {
            url: "http://localhost:3000/user",
            method: 'GET',
            json: {}
        }
        request(requestOptions1,  (err, response, body)  =>
        {
            //console.log(body);
            if (err) {
                console.log(err);
            } else if (response.statusCode === 200) {
                for(x in body) {
                    if (body[x].username == username) {
                        //console.log(body[x]);
                        miniobject = body[x];
                        console.log(miniobject)
                    }
                }
                if (!miniobject) {
                    console.log("asd");
                }
            } else {
                console.log(response.statusCode);
            }
        });

       /* console.log(miniobject);
        if (miniobject.id) {
            console.log(id);
            let customobject = {};
            customobject.username = username;
            customobject.password = password;
            const requestOptions = {
                url: "http://localhost:3000/user/" + minobject.id,
                method: 'PATCH',
                json: customobject
            }
            request(requestOptions, (err, response, body) => {
                if (err) {
                    console.log(err);
                } else if (response.statusCode === 200) {
                    res.status(210).json({"Status": "OK"});
                    //res.json(body);  //Return object
                } else {
                    res.status(400).send("An error was Encountered,check again");
                    console.log(response.statusCode);
                }
            });
        }
        else {
            res.status(400).send("No user with such username was found");
        }
    }
}*/


module.exports={
    getUsers,
    getUserByUsername,
    createUser
    //deleteUser
    //updateUser
}