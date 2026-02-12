// This is the business layer for 3-tier architecture  
const persistence = require('./persistence');
const config = require('./config');

/**
 * Fetches all employees from the persistence layer.
 * @returns {Promise<Array<Object>>}
 */
async function allEmployees() {
    return await persistence.loadEmployeesData();
}

/**
 * Adds a new employee to the system and returns the updated list of employees.
 * @param {string} empName - Employee name
 * @param {string} empPhone - Employee phone number
 * @returns {Promise<Array<Object>>}
 */
async function addEmployee(empName, empPhone) {
    let employeeData = await persistence.loadEmployeesData();
    let maxId = 0;

    // Generate new ID by checking existing employee data
    for (let e of employeeData) {
        let numId = parseInt(e.employeeId.slice(1));
        if (numId > maxId) {
            maxId = numId;
        }
    }

    // Generate the new employee ID
    let newId = 'E' + String(maxId + 1).padStart(3, '0');
    let newEmployee = {
        employeeId: newId,
        name: empName,
        phone: empPhone
    };

    // Add the new employee to the list
    employeeData.push(newEmployee);

    // Save the updated employee list
    await persistence.writeEmployeeData(employeeData);

    return employeeData;  
}

/**
 * Assigns an employee to a shift and returns the updated assignment list.
 * @param {string} empID - Employee ID
 * @param {string} shiftID - Shift ID
 * @returns {Promise<Array<Object>>}
 */
async function assignEmployeeToShift(empID, shiftID) {
    let assignmentData = await persistence.loadAssignmentData();
    let shiftData = await persistence.loadShiftsData();
    let employeeData = await persistence.loadEmployeesData();

    // To get maxDailyHours from the config file
    let maxDailyHours = config.maxDailyHours; 

    let employee_exists = false;
    let shift_exists = false;
    let assigned = false;
    let newShift = null;

    // Check if employee exists
    for (let e of employeeData) {
        if (e.employeeId === empID) {
            emp_exists = true;
            break;
        }
    }

    if (!emp_exists) {
        return { error: 'Employee does not exist' };
    }

    // Check if shift exists
    for (let s of shiftData) {
        if (s.shiftId === shiftID) {
            shift_exists = true;
            newShift = s;
            break;
        }
    }

    if (!shift_exists) {
        return { error: 'Shift does not exist' };
    }

    // Check if employee is already assigned to this shift
    for (let a of assignmentData) {
        if (a.employeeId === empID && a.shiftId === shiftID) {
            assigned = true;
            break;
        }
    }

    if (assigned) {
        return { error: 'Employee already assigned to this shift' };
    }

    // Intialize total scheduled hours for the employee on the same day 
    let totalHoursScheduled = 0;

    // To find shifts assigned to the employee
    for (let i = 0; i < assignmentData.length; i++) {
        let assignment = assignmentData[i];
        
        // If this assignment belongs to our employee
        if (assignment.employeeId === empID) {
            
            // To find the shift details in shift_data to check the date and time
            for (let j = 0; j < shiftData.length; j++) {
                let shift = shiftData[j];

                // Only counts if it's the shift from the assignment and on the same date as newShift
                if (shift.shiftId === assignment.shiftId && shift.date === newShift.date) {
                    
                    totalHoursScheduled += computeShiftDuration(shift.startTime, shift.endTime);

                }
            }
        }
    }

    // To extract hours and minutes from the new shift's startTime and endTime
   let newShiftDuration= computeShiftDuration(newShift.startTime, newShift.endTime);

    if (totalHoursScheduled + newShiftDuration > maxDailyHours) {
        return { error: `Employee's total scheduled hours exceed the daily limit of ${maxDailyHours} hours.` };
    }
    
    // Create a new assignment
    let new_assignment = { employeeId: empID, shiftId: shiftID };
    assignmentData.push(new_assignment);

    // Save the updated assignment list
    await persistence.writeAssignmentData(assignment_data);

    return assignmentData;  
}

/**
 * Computes the duration between startTime and endTime in hours.
 * The function parses the times in HH:mm format and returns the difference as a decimal number of hours.
 * 
 * LLM used: OpenAI GPT-4
 * Prompt used: "Write a JavaScript function that takes two times in the format 'HH:mm' and calculates the difference between them as a real number of hours. 
 * The function should return a floating-point number, for example, if the times are 11:00 and 13:30, the return value should be 2.5."
 * 
 * @param {string} startTime - Start time in HH:mm format (24-hour format).
 * @param {string} endTime - End time in HH:mm format (24-hour format).
 * @returns {number} - The duration between the start and end times in hours.
 */
function computeShiftDuration(startTime, endTime) {
    // Extract hours and minutes from the startTime and endTime
    let startHour = parseInt(startTime.substring(0, 2));
    let startMinute = parseInt(startTime.substring(3, 5));
    let endHour = parseInt(endTime.substring(0, 2));
    let endMinute = parseInt(endTime.substring(3, 5));

    // Convert start and end times into total minutes
    let startInMinutes = startHour * 60 + startMinute;
    let endInMinutes = endHour * 60 + endMinute;

    // Calculate the duration in minutes and convert to hours
    let durationInMinutes = (endInMinutes - startInMinutes + 1440) % 1440;
    return durationInMinutes / 60;  

}

/**
 * Returns the schedule for a specific employee.
 * @param {string} empID - Employee ID
 * @returns {Promise<Array<Object>>}
 */
async function viewEmployeeSchedule(empID) {
    let assignmentData = await persistence.loadAssignmentData();
    let shiftData = await persistence.loadShiftsData();

    let schedule = [];

    for (let a of assignmentData) {
        if (a.employeeId === empID) {
            let shift = shiftData.find(s => s.shiftId === a.shiftId);
            if (shift) {
                schedule.push({
                    date: shift.date,
                    startTime: shift.startTime,
                    endTime: shift.endTime
                });
            }
        }
    }

    return schedule;  
}

module.exports = {
    allEmployees,
    addEmployee,
    assignEmployeeToShift,
    viewEmployeeSchedule

};



