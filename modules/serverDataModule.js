const Sequelize = require('sequelize');
var sequelize = new Sequelize('dei74nlmjjn2n1','nsogtukievakrx','5da4f9190db8e890035de33423145533983067959c9a9ab6f228b651c68118e2',{
    host:'ec2-18-233-137-77.compute-1.amazonaws.com',
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
        Employee.findAll().then((data) => {
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
}



module.exports.getDepartments = function(){

    return new Promise(function(resolve,reject){
        Department.findAll().then((data)=>{
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
    })
}

module.exports.deleteEmployeeByNum = function(empNum){
    
    return new Promise(function(resolve,reject){
        Employee.destroy({
            where: {
                employeeNum: empNum
            }
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject();
        })
    });
}

module.exports.getEmployeesByDepartment = function(department){

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
    return new Promise(function(resolve,reject){
        Department.findAll({
            where: {
                departmentId: id
            }
        }).then((data)=>{
            data = data.map(value => value.dataValues);
            resolve(data[0]);
        }).catch((err)=>{
            reject("no results returned");
        })
    })
}

module.exports.addEmployee = function(employeeObject){
    employeeObject.isManager = (employeeObject.isManager) ? true : false;
    for(var prop in employeeObject){
        if(employeeObject[prop] == "") {
            employeeObject[prop] = null; //??????????????????
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
            hireDate: employeeObject.hireDate,
            department: employeeObject.department
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to create employee");
        })
    })
    
}

module.exports.updateEmployee = function(employeeData){
    employeeData.isManager = (employeeData.isManager)?true:false;
    for(var prop in employeeData){
        if(employeeData[prop] == "") {
            employeeData[prop] = null; //??????????????????
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
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to update employee");
        })
    })
}


module.exports.addDepartment = function(departmentData) {
    
    for(var prop in departmentData){
        if(departmentData.prop == "") {
            departmentData.prop = null; //??????????????????
        }
    }

    return new Promise((resolve, reject) => {
        Department.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to create department");
        })
    });
}

module.exports.updateDepartment = function(departmentData) {
    for(const prop in departmentData){
        if(departmentData.prop == "") {
            departmentData.prop = null; //??????????????????
        }
    }
    return new Promise((resolve, reject) => {
        Department.update({
            departmentName: departmentData.departmentName
        },{
            where: {
                departmentId : departmentData.departmentId
            }
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to update department");
        })
    })

}

module.exports.deleteDepartmentById = function(id) {
    return new Promise((resolve, reject) => {
        Department.destroy({
            where: {
                departmentId: id
            }
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to delete department");
        })
    })
}
