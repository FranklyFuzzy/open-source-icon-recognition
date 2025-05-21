const fs = require('fs');
const path = require('path');

// Paths to database files
const STIR_DB_PATH = path.join(__dirname, '../../data/stir/stir-database.json');
const BEIR_DB_PATH = path.join(__dirname, '../../data/beir/beir-database.json');

// Schema validation functions
function validateStirIcon(icon) {
  const errors = [];
  
  // Required fields
  if (!icon.id) errors.push(`Missing 'id' field`);
  if (!icon.name) errors.push(`Missing 'name' field for ${icon.id || 'unknown icon'}`);
  if (!icon.category) errors.push(`Missing 'category' field for ${icon.name || icon.id || 'unknown icon'}`);
  if (!icon.icon_path) errors.push(`Missing 'icon_path' field for ${icon.name || icon.id || 'unknown icon'}`);
  
  // Platforms validation
  if (!icon.platforms) {
    errors.push(`Missing 'platforms' field for ${icon.name || icon.id || 'unknown icon'}`);
  } else {
    if (typeof icon.platforms.windows !== 'boolean') 
      errors.push(`'platforms.windows' must be a boolean for ${icon.name}`);
    if (typeof icon.platforms.mac !== 'boolean') 
      errors.push(`'platforms.mac' must be a boolean for ${icon.name}`);
    if (typeof icon.platforms.linux !== 'boolean') 
      errors.push(`'platforms.linux' must be a boolean for ${icon.name}`);
  }
  
  // Field format validation
  if (icon.id && !/^[a-z0-9-]+$/.test(icon.id)) 
    errors.push(`'id' must be lowercase with hyphens for spaces: ${icon.id}`);
  
  // Icon path validation
  if (icon.icon_path && !icon.icon_path.startsWith('icons/')) 
    errors.push(`'icon_path' must start with 'icons/': ${icon.icon_path}`);
  
  return errors;
}

function validateBeirIcon(icon) {
  const errors = [];
  
  // Required fields
  if (!icon.id) errors.push(`Missing 'id' field`);
  if (!icon.name) errors.push(`Missing 'name' field for ${icon.id || 'unknown icon'}`);
  if (!icon.category) errors.push(`Missing 'category' field for ${icon.name || icon.id || 'unknown icon'}`);
  if (!icon.icon_path) errors.push(`Missing 'icon_path' field for ${icon.name || icon.id || 'unknown icon'}`);
  
  // Browsers validation
  if (!icon.browsers) {
    errors.push(`Missing 'browsers' field for ${icon.name || icon.id || 'unknown icon'}`);
  } else {
    if (typeof icon.browsers.chrome !== 'boolean') 
      errors.push(`'browsers.chrome' must be a boolean for ${icon.name}`);
    if (typeof icon.browsers.firefox !== 'boolean') 
      errors.push(`'browsers.firefox' must be a boolean for ${icon.name}`);
  }
  
  // Field format validation
  if (icon.id && !/^[a-z0-9-]+$/.test(icon.id)) 
    errors.push(`'id' must be lowercase with hyphens for spaces: ${icon.id}`);
  
  // Icon path validation
  if (icon.icon_path && !icon.icon_path.startsWith('icons/')) 
    errors.push(`'icon_path' must start with 'icons/': ${icon.icon_path}`);
  
  return errors;
}

// Validate database files
function validateStirDatabase() {
  console.log('Validating STIR database...');
  
  try {
    const data = JSON.parse(fs.readFileSync(STIR_DB_PATH, 'utf8'));
    
    // Check overall structure
    if (!data.icons || !Array.isArray(data.icons)) {
      console.error('❌ Invalid STIR database structure: missing or invalid "icons" array');
      process.exit(1);
    }
    
    // Check for duplicate IDs
    const ids = new Set();
    const duplicateIds = [];
    
    // Validate each icon
    let totalErrors = 0;
    
    data.icons.forEach((icon, index) => {
      // Check for duplicates
      if (icon.id) {
        if (ids.has(icon.id)) {
          duplicateIds.push(icon.id);
        } else {
          ids.add(icon.id);
        }
      }
      
      // Validate schema
      const errors = validateStirIcon(icon);
      
      if (errors.length > 0) {
        console.error(`❌ Issues with STIR icon #${index + 1} (${icon.name || icon.id || 'unknown'}):`);
        errors.forEach(err => console.error(`   - ${err}`));
        totalErrors += errors.length;
      }
    });
    
    // Report duplicates
    if (duplicateIds.length > 0) {
      console.error('❌ Duplicate IDs found in STIR database:');
      duplicateIds.forEach(id => console.error(`   - ${id}`));
      totalErrors += duplicateIds.length;
    }
    
    // Final result
    if (totalErrors === 0) {
      console.log(`✅ STIR database validation passed (${data.icons.length} icons)`);
      return true;
    } else {
      console.error(`❌ STIR database validation failed with ${totalErrors} errors`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error reading or parsing STIR database: ${error.message}`);
    return false;
  }
}

function validateBeirDatabase() {
  console.log('Validating BEIR database...');
  
  try {
    const data = JSON.parse(fs.readFileSync(BEIR_DB_PATH, 'utf8'));
    
    // Check overall structure
    if (!data.icons || !Array.isArray(data.icons)) {
      console.error('❌ Invalid BEIR database structure: missing or invalid "icons" array');
      process.exit(1);
    }
    
    // Check for duplicate IDs
    const ids = new Set();
    const duplicateIds = [];
    
    // Validate each icon
    let totalErrors = 0;
    
    data.icons.forEach((icon, index) => {
      // Check for duplicates
      if (icon.id) {
        if (ids.has(icon.id)) {
          duplicateIds.push(icon.id);
        } else {
          ids.add(icon.id);
        }
      }
      
      // Validate schema
      const errors = validateBeirIcon(icon);
      
      if (errors.length > 0) {
        console.error(`❌ Issues with BEIR icon #${index + 1} (${icon.name || icon.id || 'unknown'}):`);
        errors.forEach(err => console.error(`   - ${err}`));
        totalErrors += errors.length;
      }
    });
    
    // Report duplicates
    if (duplicateIds.length > 0) {
      console.error('❌ Duplicate IDs found in BEIR database:');
      duplicateIds.forEach(id => console.error(`   - ${id}`));
      totalErrors += duplicateIds.length;
    }
    
    // Final result
    if (totalErrors === 0) {
      console.log(`✅ BEIR database validation passed (${data.icons.length} icons)`);
      return true;
    } else {
      console.error(`❌ BEIR database validation failed with ${totalErrors} errors`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error reading or parsing BEIR database: ${error.message}`);
    return false;
  }
}

// Run validations
const stirValid = validateStirDatabase();
const beirValid = validateBeirDatabase();

// Exit with appropriate status code
if (stirValid && beirValid) {
  console.log('✅ All database validations passed');
  process.exit(0);
} else {
  console.error('❌ Database validation failed');
  process.exit(1);
}