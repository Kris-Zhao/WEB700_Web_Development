var employees = [];
var departments = [];

const fs = require('fs');

module.exports.initialzie = function(){

    return new Promise(function(resolve,reject){
        fs.readFile('./data/employees.json', 'utf8', function(err, data){
            if(err){
                reject("Unable to read file");
            } else{
                let obj1 = JSON.parse(data);
                employees = obj1;                

                fs.readFile('./data/departments.json', 'utf8', function(err, data){
                    if(err){
                        reject("Unable to read file");
                    }else{
                        let obj2 = JSON.parse(data);
                        departments = obj2;
                        resolve("The oepration was a success.");
                    }
                })
            }
        })
    })
}

module.exports.getALLEmployees = function(){

    return new Promise(function(resolve,reject){
        if (employees.length  == 0){
            reject("no results returned");
        }
        else{
            resolve(employees);
        }
    })
}


module.exports.getManagers = function(){

    let managers = [];

    return new Promise(function(resolve,reject){

        for (var i = 0; i < employees.length; i++){
                
            if(employees[i].isManager == true){
                managers.push(employees[i]);
            }
        }

        if (managers.length == 0){
            reject("no results returned");
        }
        else{
            resolve(managers);
            }
        })
}


module.exports.getDepartments = function(){

    return new Promise(function(resolve,reject){
        if (departments.length  == 0){
            reject("no results returned");
        }
        else{
            resolve(departments);
        }
    })
}

module.exports.getEmployeesByDepartment = function(department){
    let employeesByDepartment = [];
    return new Promise(function(resolve,reject){
        for(var i = 0; i < employees.length; i++){
            if(employees[i].department == department){
                employeesByDepartment.push(employees[i]);
            }
        }
        if (employeesByDepartment.length == 0){
            reject("no results returned");
        }
        else{
            resolve(employeesByDepartment);
            }
    })
}

module.exports.getEmployeeByNum = function(num){
    let singleEmployee;
    return new Promise(function(resolve,reject){
        for(var i =0;i < employees.length; i++){
            if(employees[i].employeeNum == num){
                singleEmployee = employees[i];
            }
        }
        if (singleEmployee == undefined){
            reject("no results returned");
        }
        else{
            resolve(singleEmployee);
        }
    })
}

module.exports.getDepartmentById = function(id){
    let singleDepartment;
    return new Promise(function(resolve,reject){
        for(var i=0;i<departments.length;i++){
            if(departments[i].departmentId == id){
                singleDepartment = departments[i];
            }
        }
        if (singleDepartment == undefined){
            reject("query returned 0 results");
        }
        else{
            resolve(singleDepartment);
        }
    })
}

module.exports.addEmployee = function(employeeObject){
    return new Promise((resolve,reject) => {
        employeeObject.isManager = (employeeObject.isManager) ? true : false;
        employeeObject.employeeNum = employees.length + 1;
        employees.push(employeeObject);
       
        resolve();
    })
    
}

module.exports.updateEmployee = function(employeeData){
    return new Promise((resolve,reject) => {
        for(var i=0;i<employees.length;i++){
            if(employees[i].employeeNum == employeeData.employeeNum){
                employees[i] = employeeData;
                //employees[i].isManager = (employees[i].isManager) ? true : false;
                resolve();
            }
            
        }
    })
}