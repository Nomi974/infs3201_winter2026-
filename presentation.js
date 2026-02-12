// This is the presentation layer for 3-tier architecture  
const business = require('./business');
const prompt = require('prompt-sync')();


async function showMenu() {
    while (true) {
        console.log('Options:');
        console.log('1. Show all employees');
        console.log('2. Add new employee');
        console.log('3. Assign employee to shift');
        console.log('4. View employee schedule');
        console.log('5. Quit');
        
        let selection = Number(prompt('What is your choice? '));
        
        if (selection === 1) {
            let employees = await business.allEmployees();
            console.log('Employee ID\tName\t\t\tPhone');
            console.log('--------------\t----------------\t-------------');
            if (employees.length === 0) {
                console.log('There are no employees.');
            } else {
                for (let e of employees) {
                    console.log(`${e.employeeId}\t\t${e.name}\t\t${e.phone}`);
                }
            }
        }
        else if (selection === 2) {
            let name = prompt('Enter employee name: ');
            let phone = prompt('Enter employee phone number: ');
            let result = await business.addEmployee(name, phone);
            console.log('Employee added successfully.');
        }
        else if (selection === 3) {
            let empId = prompt('Enter employee ID: ');
            let shiftId = prompt('Enter shift ID: ');
            let result = await business.assignEmployeeToShift(empId, shiftId);
            if (result.error) {
                console.log(result.error);
            } else {
                console.log('Employee successfully assigned to shift.');
            }
        }
        else if (selection === 4) {
            let empId = prompt('Enter employee ID: ');
            let schedule = await business.viewEmployeeSchedule(empId);
            if (schedule.length === 0) {
                console.log('No shifts assigned.');
            } else {
                console.log('Scheduled Shifts:');
                for (let s of schedule) {
                    console.log(`${s.date}, ${s.startTime}, ${s.endTime}`);
                }
            }
        }
        else if (selection === 5) {
            break; 
        }
        else {
            console.log('Invalid choice! Please select a number between 1 and 5.');
        }
    }
}

showMenu();



