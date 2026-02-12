// This is the persistence layer for 3-tier architecture  
const fs = require('fs/promises');

/**
 * Reads assignment data from the assignments JSON file.
 *
 * @async
 * @returns {Promise<Array<Object>>} Array of assignment objects
 */
async function loadAssignmentData() {

    let rawAssignment = await fs.readFile('assignments.json')
    let assignmentData = await JSON.parse(rawAssignment)

    return assignmentData
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

    let rawEmployee = await fs.readFile('employees.json')
    let employeeData = await JSON.parse(rawEmployee)

    return employeeData
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

    let rawShifts = await fs.readFile('shifts.json')
    let shiftData = await JSON.parse(rawShifts)

    return shiftData
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



