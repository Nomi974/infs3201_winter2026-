// This is the persistence layer for 3-tier architecture  
const fs = require('fs/promises');

/**
 * Reads assignment data from the assignments JSON file.
 *
 * @async
 * @returns {Promise<Array<Object>>} Array of assignment objects
 */
async function loadAssignmentData() {

    let raw_assignment = await fs.readFile('assignments.json')
    let assignment_data = await JSON.parse(raw_assignment)

    return assignment_data
}

/**
 * Writes assignment data to the assignments JSON file.
 *
 * @async
 * @param {Array<Object>} assignmentList - List of assignment objects to save
 * @returns {Promise<void>}
 */
async function writeAssignmentData(assignmentList) {

    await fs.writeFile('assignments.json', JSON.stringify(assignmentList))
    
}

/**
 * Reads employee data from the employees JSON file.
 *
 * @async
 * @returns {Promise<Array<Object>>} Array of employee objects
 */
async function loadEmployeesData() {

    let raw_employee = await fs.readFile('employees.json')
    let employee_data = await JSON.parse(raw_employee)

    return employee_data
}

/**
 * Writes employee data to the employees JSON file.
 *
 * @async
 * @param {Array<Object>} employeeList - List of employee objects to save
 * @returns {Promise<void>}
 */
async function writeEmployeeData(employeeList) {

    await fs.writeFile('employees.json', JSON.stringify(employeeList))
    
}

/**
 * Reads shift data from the shifts JSON file.
 *
 * @async
 * @returns {Promise<Array<Object>>} Array of shift objects
 */
async function loadShiftsData() {

    let raw_shifts = await fs.readFile('shifts.json')
    let shift_data = await JSON.parse(raw_shifts)

    return shift_data
}

/**
 * Writes shift data to the shifts JSON file.
 *
 * @async
 * @param {Array<Object>} shiftList - List of shift objects to save
 * @returns {Promise<void>}
 */
async function writeShiftsData(shiftList) {

    await fs.writeFile('shifts.json', JSON.stringify(shiftList))
   
}

module.exports = {
    loadEmployeesData,
    writeEmployeeData,
    loadAssignmentData,
    writeAssignmentData,
    loadShiftsData,
    writeShiftsData
    
};



