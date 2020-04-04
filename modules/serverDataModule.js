const Sequelize = require('sequelize');
var sequelize = new Sequelize('dei74nlmjjn2n1','nsogtukievakrx','5da4f9190db8e890035de33423145533983067959c9a9ab6f228b651c68118e2',{
    host:'host',
    dialect:'postgres',
    port:5432,
    dialectOptions: {
        ssl: {rejectUnauthorized:false}
    }
});

//define a Employee model
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
});

//create a Department model
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

//define the hasMany relationship
Department.hasMany(Employee,{foreignKey:'department'});


module.exports.initialzie = function(){

    return new Promise(function(resolve,reject){
        sequelize.sync().then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to sync the database");
        });
    });
}

module.exports.getALLEmployees = function(){

    return new Promise(function(resolve,reject){
        Employee.findAll().then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data)
        }).catch((err)=>{
            reject("no results returned");
        });
    });
}



module.exports.getManagers = function(){

    let managers = [];

    return new Promise(function(resolve,reject){

        reject();
        })
}


module.exports.getDepartments = function(){

    return new Promise(function(resolve,reject){
        Department.findAll().then((data)=>{
            data = data.map(values=>value.dataValues);
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
    })
}

module.exports.getEmployeesByDepartment = function(department){
    //let employeesByDepartment = [];
    return new Promise(function(resolve,reject){
        Employee.findAll({
            where: {
                department: department
            }
        }).then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch((err)=>{
            reject("no results returned")
        })
    })
}

module.exports.getEmployeeByNum = function(num){
    //let singleEmployee;
    return new Promise(function(resolve,reject){
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then((data)=>{
            data = data.map(value => value.dataValues);
            resolve(data); 
        }).catch((err)=>{
            reject("no results returned");
        })
    })
}

module.exports.getDepartmentById = function(id){
    //let singleDepartment;
    return new Promise(function(resolve,reject){
        reject();
    })
}

module.exports.addEmployee = function(employeeObject){
    employeeObject.isManager = (employeeObject.isManager)?true:false;
    for(const prop in employeeObject){
        if(employeeObject.prop == "") {
            employeeObject.prop = null; //??????????????????
        }
    }
    return new Promise((resolve,reject) => {
        Employee.create({
            employeeNum: employeeObject.employeeNum,
            firstName: employeeObject.firstName,
            lastName: employeeObject.lastName,
            email: employeeObject.email,
            SSN: employeeObject.SSN,
            addressStreet: employeeObject.addressCity,
            addressCity: employeeObject.addressCity,
            addressState: employeeObject.addressState,
            addressPostal: employeeObject.addressPostal,
            isManager: employeeObject.isManager,
            employeeManagerNum: employeeObject.employeeManagerNum,
            status: employeeObject.status,
            hireDate: employeeObject.hireDate
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("unable to update employee");
        })
    })
    
}

module.exports.updateEmployee = function(employeeData){
    employeeData.isManager = (employeeData.isManager)?true:false;
    for(const prop in employeeData){
        if(employeeData.prop == "") {
            employeeData.prop = null; //??????????????????
        }
    }
    return new Promise((resolve,reject) => {
        Employee.update({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressCity,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            hireDate: employeeData.hireDate
        },{
            where: {
                employeeNum: employeeData.employeeNum
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("unable to update employee");
        })
    })
}
