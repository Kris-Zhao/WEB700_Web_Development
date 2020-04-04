/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _______Yuhang Zhao_______ Student ID: __150467199__ Date: __2020-04-05__
*
* Online (Heroku) Link: ____________https://glacial-fjord-85838.herokuapp.com/_____________
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
            if(data.length>0){
                res.render("employees", {employees: data});
            }else{
                res.render("employees", {message: "no results"});
            }   
        }).catch(() => {
            res.render("employess", {message: "no results"});
        });
    }
    else{
        serverDataModule.getEmployeesByDepartment(req.query.department).then((data) => {
            if(data.length>0){
                res.render("employees", {employees: data});
            }else{
                res.render("employees", {message: "no results"});
            }  
        }).catch(() => {
            res.render("employess", {message: "no results"});
        });
    }
    
});




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
        if(data == undefined){
            res.status(404).send("Department Not Found");
        }else{
            res.render("department", { department: data });
        }
    }).catch((err)=>{
        res.status(500).send("Unable to Find Department with this Id");
    })
});

app.get("/departments/add", (req, res) => {
    res.render('addDepartment');
});

app.post("/departments/add", (req, res) => {
    serverDataModule.addDepartment(req.body).then(()=>{
        res.redirect("/departments");
    }).catch((err)=>{
        res.status(500).send("Unable to Add Department");
    });
});

app.post("/department/update", (req, res) => {
    //req.body.isManager = (req.body.isManager) ? true : false;
    //console.log(req.body);
    serverDataModule.updateDepartment(req.body).then(()=>{
        res.redirect("/departments");
    }).catch((err)=>{
        res.status(500).send("Unable to Update Department");
    });
});

app.get("/departments/delete/:id", (req, res) => {
    serverDataModule.deleteDepartmentById(req.params.id).then(() => {
        res.redirect("/departments");
    }).catch((err)=>{
        res.status(500).send("Unable to Remove Department / Department not found");
    })
});



app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    serverDataModule.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data[0]; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(serverDataModule.getDepartments)
    .then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"
        // loop through viewData.departments and once we have found the departmentId that matches
        // the employee's "department" value, add a "selected" property to the matching
        // viewData.departments object
        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }
    }).catch(() => {
        viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
        if (viewData.employee == null) { // if no employee - return an error
            res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", { viewData: viewData }); // render the "employee" view
        }
    });
   });

app.get("/employees/add", (req, res) => {
    serverDataModule.getDepartments().then((data)=>{
        res.render("addEmployee",{departments: data});
    }).catch((err)=>{
        res.render("addEmployee",{departments: []});
    })
});

app.post("/employees/add", (req, res) => {
    //req.body.isManager = (req.body.isManager) ? true : false;
    //console.log(req.body);
    serverDataModule.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
    }).catch((err)=>{
        res.status(500).send("Unable to Add Employee");
    });
});

app.post("/employee/update", (req, res) => {
    req.body.isManager = (req.body.isManager) ? true : false;
    console.log(req.body);
    serverDataModule.updateEmployee(req.body).then(()=>{
        res.redirect("/employees");
    }).catch((err)=>{
        res.status(500).send("Unable to Update Employee");
    })
    

});

app.get("/employees/delete/:empNum", (req, res) => {
    serverDataModule.deleteEmployeeByNum(req.params.empNum).then(()=>{
        res.redirect("/employees");
    }).catch((err)=>{
        res.status(500).send("Unable to Remove Employee / Employee not found");
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