const path = require('path');

function loadPatientData(environment, dataType) {
  // Map dataType to the appropriate file name
  const fileMapping = {
    clinic: `${environment}clinic.js`,
    familydoc: `${environment}familydoc.js`,
    orphan: `${environment}orphan.js`,
    renew: `${environment}REnew.js`,
  };

  const fileName = fileMapping[dataType.toLowerCase()];
  if (!fileName) {
    throw new Error(`Invalid data type: ${dataType}. Supported types: clinic, familydoc, orphan, renew`);
  }

  const filePath = path.join(__dirname, `../Data/${environment}/${fileName}`);
  try {
    // Clear require cache to ensure fresh data (optional)
    delete require.cache[require.resolve(filePath)];
    return require(filePath);
  } catch (error) {
    console.error(`Error loading patient data for ${environment}/${dataType}:`, error);
    throw new Error(`Failed to load patient data: ${error.message}`);
  }
}

// Optional: Load all data types for an environment
function loadAllPatientData(environment) {
  const dataTypes = ['clinic', 'familydoc', 'orphan', 'renew'];
  const allData = {};
  
  for (const dataType of dataTypes) {
    try {
      allData[dataType] = loadPatientData(environment, dataType);
    } catch (error) {
      console.error(`Failed to load ${dataType} data for ${environment}:`, error);
    }
  }
  
  return allData;
}

module.exports = { loadPatientData, loadAllPatientData };