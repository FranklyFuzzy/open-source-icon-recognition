const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

// Paths to database and icon directories
const STIR_DB_PATH = path.join(__dirname, '../../data/stir/stir-database.json');
const BEIR_DB_PATH = path.join(__dirname, '../../data/beir/beir-database.json');
const STIR_ICONS_DIR = path.join(__dirname, '../../data/stir/icons');
const BEIR_ICONS_DIR = path.join(__dirname, '../../data/beir/icons');

// Check if a command exists
async function commandExists(command) {
  try {
    await execAsync(`which ${command}`);
    return true;
  } catch (error) {
    return false;
  }
}

// Validate icon file existence and format
async function validateIcons() {
  console.log('Validating icon files...');
  
  let hasErrors = false;
  const missingIcons = [];
  const formatErrors = [];
  
  // Check if directories exist
  if (!fs.existsSync(STIR_ICONS_DIR)) {
    console.error(`❌ STIR icons directory not found: ${STIR_ICONS_DIR}`);
    hasErrors = true;
  }
  
  if (!fs.existsSync(BEIR_ICONS_DIR)) {
    console.error(`❌ BEIR icons directory not found: ${BEIR_ICONS_DIR}`);
    hasErrors = true;
  }
  
  // If directories don't exist, exit early
  if (hasErrors) {
    return false;
  }
  
  // Load database files
  try {
    const stirData = JSON.parse(fs.readFileSync(STIR_DB_PATH, 'utf8'));
    const beirData = JSON.parse(fs.readFileSync(BEIR_DB_PATH, 'utf8'));
    
    // Check STIR icons
    console.log('Checking STIR icons...');
    for (const icon of stirData.icons) {
      if (!icon.icon_path) continue;
      
      const iconPath = path.join(STIR_ICONS_DIR, path.basename(icon.icon_path));
      
      // Check if file exists
      if (!fs.existsSync(iconPath)) {
        missingIcons.push(`STIR: ${icon.name} (${iconPath})`);
        hasErrors = true;
        continue;
      }
      
      // Check file extension
      if (path.extname(iconPath).toLowerCase() !== '.png') {
        formatErrors.push(`STIR: ${icon.name} - Icon must be PNG format`);
        hasErrors = true;
      }
    }
    
    // Check BEIR icons
    console.log('Checking BEIR icons...');
    for (const icon of beirData.icons) {
      if (!icon.icon_path) continue;
      
      const iconPath = path.join(BEIR_ICONS_DIR, path.basename(icon.icon_path));
      
      // Check if file exists
      if (!fs.existsSync(iconPath)) {
        missingIcons.push(`BEIR: ${icon.name} (${iconPath})`);
        hasErrors = true;
        continue;
      }
      
      // Check file extension
      if (path.extname(iconPath).toLowerCase() !== '.png') {
        formatErrors.push(`BEIR: ${icon.name} - Icon must be PNG format`);
        hasErrors = true;
      }
    }
    
    // Optional: If ImageMagick is available, check image dimensions
    const hasMagick = await commandExists('identify');
    
    if (hasMagick) {
      console.log('ImageMagick found, checking icon dimensions...');
      
      // Check STIR icon dimensions
      for (const icon of stirData.icons) {
        if (!icon.icon_path) continue;
        
        const iconPath = path.join(STIR_ICONS_DIR, path.basename(icon.icon_path));
        if (!fs.existsSync(iconPath)) continue;
        
        try {
          const { stdout } = await execAsync(`identify -format "%wx%h" ${iconPath}`);
          const [width, height] = stdout.trim().split('x').map(Number);
          
          if (width !== height) {
            formatErrors.push(`STIR: ${icon.name} - Icon should be square (is ${width}x${height})`);
            hasErrors = true;
          } else if (width < 32 || width > 256) {
            formatErrors.push(`STIR: ${icon.name} - Icon should be between 32px and 256px (is ${width}x${height})`);
            hasErrors = true;
          }
        } catch (error) {
          console.warn(`Warning: Could not check dimensions for ${iconPath}`);
        }
      }
      
      // Check BEIR icon dimensions
      for (const icon of beirData.icons) {
        if (!icon.icon_path) continue;
        
        const iconPath = path.join(BEIR_ICONS_DIR, path.basename(icon.icon_path));
        if (!fs.existsSync(iconPath)) continue;
        
        try {
          const { stdout } = await execAsync(`identify -format "%wx%h" ${iconPath}`);
          const [width, height] = stdout.trim().split('x').map(Number);
          
          if (width !== height) {
            formatErrors.push(`BEIR: ${icon.name} - Icon should be square (is ${width}x${height})`);
            hasErrors = true;
          } else if (width < 32 || width > 256) {
            formatErrors.push(`BEIR: ${icon.name} - Icon should be between 32px and 256px (is ${width}x${height})`);
            hasErrors = true;
          }
        } catch (error) {
          console.warn(`Warning: Could not check dimensions for ${iconPath}`);
        }
      }
    } else {
      console.log('ImageMagick not found, skipping dimension checks');
    }
    
    // Report errors
    if (missingIcons.length > 0) {
      console.error('❌ Missing icon files:');
      missingIcons.forEach(icon => console.error(`   - ${icon}`));
    }
    
    if (formatErrors.length > 0) {
      console.error('❌ Icon format errors:');
      formatErrors.forEach(error => console.error(`   - ${error}`));
    }
    
    // Final result
    if (!hasErrors) {
      console.log('✅ All icon validations passed');
      return true;
    } else {
      console.error(`❌ Icon validation failed with ${missingIcons.length + formatErrors.length} errors`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error during icon validation: ${error.message}`);
    return false;
  }
}

// Execute validation
validateIcons().then(success => {
  if (!success) {
    process.exit(1);
  }
});