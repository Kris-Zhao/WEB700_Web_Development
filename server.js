/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _______Yuhang Zhao_______ Student ID: __150467199__ Date: __2020-03-22__
*
* Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/


const path = require("path");
const serverDataModule = require("./modules/serverDataModule.js");
const express = require("express");
const bodyParser = require("body-parser");
var app = express();

const exphbs = require("express-handlebars");
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } 
            else {
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');

var HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   });
   

// setup a 'route' to listen on the /employees
app.get("/employees", (req, res) => {
    if(req.query.department == undefined){
        serverDataModule.getALLEmployees().then((data) => {
            res.render("employees", {employees: data});
        }).catch(() => {
            res.render("employess", {message: "no results"});
        });
    }
    else{
        serverDataModule.getEmployeesByDepartment(req.query.department).then((data) => {
            res.render("employees", {employees: data});
        }).catch(() => {
            res.render("employess", {message: "no results"});
        });
    }
    
});


/*
// setup a 'route' to listen on the /managers
app.get("/managers", (req, res) => {
    serverDataModule.getManagers().then(function(data){
        res.json(data);
    }).catch(function(){
        res.json({message:"no results"});
    })
});
*/

// setup a 'route' to listen on the /departments
app.get("/departments", (req, res) => {
    serverDataModule.getDepartments().then(function(data){
        res.render("departments", {departments: data});
    }).catch(function(){
        res.render("departments", {message: "no results"});
    })
});

app.get("/department/:id", (req, res) => {
    serverDataModule.getDepartmentById(req.params.id).then(function(data){
        res.render("department", { department: data });
    })
});

// setup a 'route' to listen on the /employee/:num
app.get("/employee/:num", (req, res) => {
    serverDataModule.getEmployeeByNum(req.params.num).then(function(data){
        res.render("employee", { employee: data });
    })
    
});

app.get("/employees/add", (req, res) => {
    res.render('addEmployee');
});

app.post("/employees/add", (req, res) => {
    //req.body.isManager = (req.body.isManager) ? true : false;
    //console.log(req.body);
    serverDataModule.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
    }).catch((err)=>{
        res.status(500).end();
    });
});

app.post("/employee/update", (req, res) => {
    req.body.isManager = (req.body.isManager) ? true : false;
    console.log(req.body);
    serverDataModule.updateEmployee(req.body).then(()=>{
        res.redirect("/employees");
    })
    

});


// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.render('home');
});


// setup a 'route' to listen on the /about
app.get("/about", (req, res) => {
    res.render('about');
});

// setup a 'route' to listen on the /htmlDemo
app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo');
});


// for no matching route
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/imgfor404/404.png"));
    //res.status(404).send("Page Not Found");
});

// firstly initialize, if sucessed setup http server to listen on HTTP_PORT, else report err
serverDataModule.initialzie().then(() => {
    app.listen(HTTP_PORT,()=>{
        console.log("Server listening on port: "+ HTTP_PORT)
    });}).catch((err) => {
        console.log(err);
    }); 