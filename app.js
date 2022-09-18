
// require() is similar to import in python but in this case we assign to an object
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");

const app = express();


// middleware is a software that lies between an os and applications running on it
// middleware function: a hidden translation layer, middleware enables communication and data management for distributed applications
// body parser provides four express middleware: for parsing JSON, Text, URL-encoded, raw data set over an HTTP request body
// process data sent to HTTP request body
app.use(bodyParser.urlencoded({extended: true}));

// provide the application with the static file folder in this case is public
app.use(express.static("public"));

// specify the local route as home page and structure using html file
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signUp.html");

});

// send data to the mailchimp (server)
app.post("/", function(req, res) {

    // with the objects below, the application will request info 
    // from users and assign it to constant
    const firstName  = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // store data from users
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    // convert js to flat pack JSON string
    const jsonData = JSON.stringify(data);

    // url of the list subscriber want to go into
    const url = "https://us18.api.mailchimp.com/3.0/lists/yourID;

    // pass through auth
    const options = {
        method: "POST",
        auth: "yourAUTH"

    }

    // collect user input
    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })

    })

    // pass data to mailchimp server
    request.write(jsonData);
    request.end();

})


// redirect back to home route
app.post("/failure", function(req, res) {
    res.redirect("/")

});


// app.listen() function is used to bind and listen the connections on the specified host and port
app.listen(process.env.PORT || 3000, function() {
    response.on("data", function(data) {
        console.log("JSON.parse(data))");
    });
});


// https://nameless-dusk-92056.herokuapp.com/