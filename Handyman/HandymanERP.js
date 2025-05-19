/**
 * Handyman ERP example using Google Apps Script.
 * This script demonstrates how to manage job records,
 * clients, and materials in Google Sheets.
 * It relies on the GasCrud library from this repository.
 */

// Spreadsheet and sheet configuration
const HM_SPREADSHEET = 'YOUR_SPREADSHEET_ID_HERE';
const JOB_SHEET = 'Jobs';
const CLIENT_SHEET = 'Clients';
const MATERIAL_SHEET = 'Materials';

// Column settings for the Jobs sheet
const JOB_KEY_COL = 'A';
const JOB_FIRST_COL = 'A';
const JOB_LAST_COL = 'H';

/**
 * Add a new job record and return the generated Job ID.
 * @param {Object} job - Job details
 *        {jobDate, clientId, clientName, description, materials, cost, status}
 * @return {string} jobId
 */
function addJob(job) {
  job.jobId = GasCrud.generateKey();
  const row = [
    job.jobId,
    job.jobDate,
    job.clientId,
    job.clientName,
    job.description,
    job.materials,
    job.cost,
    job.status
  ];
  GasCrud.createRecord(HM_SPREADSHEET, JOB_SHEET, row);
  return job.jobId;
}

/**
 * Get the most recent n job records.
 * @param {number} n - Number of rows to retrieve
 * @return {Array} Array of job rows
 */
function getRecentJobs(n) {
  return GasCrud.getTailRows(n, HM_SPREADSHEET, JOB_SHEET, JOB_FIRST_COL, JOB_LAST_COL);
}

/**
 * Update an existing job.
 * @param {string} jobId - Existing job ID
 * @param {Object} newData - Object containing updated job fields
 */
function updateJob(jobId, newData) {
  const result = GasCrud.searchRecordByKey(jobId, HM_SPREADSHEET, JOB_SHEET, JOB_KEY_COL, JOB_FIRST_COL, JOB_LAST_COL);
  if (result.rowIndex > 0) {
    const row = [
      jobId,
      newData.jobDate,
      newData.clientId,
      newData.clientName,
      newData.description,
      newData.materials,
      newData.cost,
      newData.status
    ];
    GasCrud.updateRecord(HM_SPREADSHEET, JOB_SHEET, result.range, row);
  }
}

/**
 * Delete a job record by ID.
 * @param {string} jobId - Job ID to remove
 */
function deleteJob(jobId) {
  GasCrud.deleteRecord(HM_SPREADSHEET, JOB_SHEET, jobId, 'JOB ID');
}

/**
 * Get upcoming jobs within a specific number of days.
 * @param {number} days - Days from today to include
 * @return {Array} Array of job rows
 */
function getUpcomingJobs(days) {
  const data = GasCrud.readRecord(HM_SPREADSHEET, JOB_SHEET, false, JOB_FIRST_COL, JOB_LAST_COL);
  const today = new Date();
  const limitDate = new Date();
  limitDate.setDate(today.getDate() + days);

  return data.filter(row => {
    const jobDate = new Date(row[1]);
    return jobDate >= today && jobDate <= limitDate;
  });
}
