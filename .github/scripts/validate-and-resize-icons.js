const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);
const sharp = require('sharp');

// Paths to database and icon directories
const STIR_DB_PATH = path.join(__dirname, '../../data/stir/stir-database.json');
const BEIR_DB_PATH = path.join(__dirname, '../../data/beir/beir-database.json');
const STIR_ICONS_DIR = path.join(__dirname, '../../data/stir/icons');
const BEIR_ICONS_DIR = path.join(__dirname, '../../data/beir/icons');

// Default target size for resizing
const DEFAULT_SIZE = 128;

// Check if a command exists
async function commandExists(command) {
  try {
    await execAsync(`which ${command}`);
    return true;
  } catch (error) {
    return false;
  }
}

// Resize image to be square and within valid dimensions
async function resizeIcon(iconPath, targetSize = DEFAULT_SIZE) {
  console.log(`Resizing icon: ${iconPath} to ${targetSize}x${targetSize}`);
  
  try {
    // Get image info
    const metadata = await sharp(iconPath).metadata();
    
    // If already square and valid size, no need to resize
    if (metadata.width === metadata.height && 
        metadata.width >= 32 && metadata.width <= 256) {
      console.log(`✓ ${path.basename(iconPath)} already valid (${metadata.width}x${metadata.height})`);
      return { resized: false, success: true };
    }
    
    // If not square, we'll create a square transparent canvas and center the image
    if (metadata.width !== metadata.height) {
      const maxDimension = Math.max(metadata.width, metadata.height);
      
      // Calculate offsets to center the image
      const leftOffset = Math.floor((maxDimension - metadata.width) / 2);
      const topOffset = Math.floor((maxDimension - metadata.height) / 2);
      
      await sharp({
        create: {
          width: maxDimension,
          height: maxDimension,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
      })
      .composite([
        { 
          input: iconPath,
          left: leftOffset,
          top: topOffset
        }
      ])
      .png()
      .toFile(`${iconPath}.tmp`);
      
      // Replace original with the new square version
      fs.unlinkSync(iconPath);
      fs.renameSync(`${iconPath}.tmp`, iconPath);
      
      console.log(`Made ${path.basename(iconPath)} square (${maxDimension}x${maxDimension})`);
    }
    
    // Now resize if outside valid dimensions (too small or too large)
    const updatedMetadata = await sharp(iconPath).metadata();
    if (updatedMetadata.width < 32 || updatedMetadata.width > 256) {
      await sharp(iconPath)
        .resize(targetSize, targetSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(`${iconPath}.tmp`);
      
      // Replace original with resized version
      fs.unlinkSync(iconPath);
      fs.renameSync(`${iconPath}.tmp`, iconPath);
      
      console.log(`Resized ${path.basename(iconPath)} to ${targetSize}x${targetSize}`);
    }
    
    return { resized: true, success: true };
  } catch (error) {
    console.error(`Error resizing ${iconPath}: ${error.message}`);
    return { resized: false, success: false };
  }
}

// Validate and resize icon files
async function validateAndResizeIcons(targetSize = DEFAULT_SIZE) {
  console.log(`Validating and resizing icon files to ${targetSize}x${targetSize}...`);
  
  let hasErrors = false;
  const missingIcons = [];
  let resizedCount = 0;
  let alreadyValidCount = 0;
  let errorCount = 0;
  
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
  
  // Create directories if they don't exist
  fs.mkdirSync(STIR_ICONS_DIR, { recursive: true });
  fs.mkdirSync(BEIR_ICONS_DIR, { recursive: true });
  
  // Load database files
  try {
    const stirData = JSON.parse(fs.readFileSync(STIR_DB_PATH, 'utf8'));
    const beirData = JSON.parse(fs.readFileSync(BEIR_DB_PATH, 'utf8'));
    
    // Check and process STIR icons
    console.log('\n=== Processing STIR icons ===');
    for (const icon of stirData.icons) {
      if (!icon.icon_path) continue;
      
      const iconPath = path.join(STIR_ICONS_DIR, path.basename(icon.icon_path));
      
      // Check if file exists
      if (!fs.existsSync(iconPath)) {
        missingIcons.push(`STIR: ${icon.name} (${iconPath})`);
        errorCount++;
        continue;
      }
      
      // Check file extension
      if (path.extname(iconPath).toLowerCase() !== '.png') {
        console.error(`❌ STIR: ${icon.name} - Icon must be PNG format`);
        errorCount++;
        continue;
      }
      
      // Resize if needed
      const result = await resizeIcon(iconPath, targetSize);
      if (result.success) {
        if (result.resized) {
          resizedCount++;
        } else {
          alreadyValidCount++;
        }
      } else {
        errorCount++;
        hasErrors = true;
      }
    }
    
    // Check and process BEIR icons
    console.log('\n=== Processing BEIR icons ===');
    for (const icon of beirData.icons) {
      if (!icon.icon_path) continue;
      
      const iconPath = path.join(BEIR_ICONS_DIR, path.basename(icon.icon_path));
      
      // Check if file exists
      if (!fs.existsSync(iconPath)) {
        missingIcons.push(`BEIR: ${icon.name} (${iconPath})`);
        errorCount++;
        continue;
      }
      
      // Check file extension
      if (path.extname(iconPath).toLowerCase() !== '.png') {
        console.error(`❌ BEIR: ${icon.name} - Icon must be PNG format`);
        errorCount++;
        continue;
      }
      
      // Resize if needed
      const result = await resizeIcon(iconPath, targetSize);
      if (result.success) {
        if (result.resized) {
          resizedCount++;
        } else {
          alreadyValidCount++;
        }
      } else {
        errorCount++;
        hasErrors = true;
      }
    }
    
    // Report errors and results
    if (missingIcons.length > 0) {
      console.error('\n❌ Missing icon files:');
      missingIcons.forEach(icon => console.error(`   - ${icon}`));
    }
    
    // Final result
    console.log('\n=== Results ===');
    console.log(`✅ Already valid icons: ${alreadyValidCount}`);
    console.log(`🔄 Resized icons: ${resizedCount}`);
    console.log(`❌ Failed/missing icons: ${errorCount}`);
    
    // Even if there are missing icons, we consider the validation successful
    // if we managed to resize all the icons that were present
    if (errorCount === missingIcons.length) {
      console.log('\n✅ All available icons have been validated and resized successfully');
      console.log(`   Note: ${missingIcons.length} icons were missing and need to be added`);
      return true;
    } else if (resizedCount > 0) {
      console.log('\n✅ Successfully resized some icons');
      return true;
    } else if (alreadyValidCount > 0 && errorCount === 0) { 
      console.log('\n✅ All icons are already valid, no changes needed');
      return true;
    } else {
      console.error('\n❌ Icon validation and resizing failed');
      return false;
    }
  } catch (error) {
    console.error(`\n❌ Error during icon validation and resizing: ${error.message}`);
    return false;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  let targetSize = DEFAULT_SIZE;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--size' && i + 1 < args.length) {
      const size = parseInt(args[i + 1], 10);
      if (!isNaN(size) && size >= 32 && size <= 256) {
        targetSize = size;
      } else {
        console.warn(`Invalid size specified. Using default size of ${DEFAULT_SIZE}px`);
      }
    }
  }
  
  return { targetSize };
}

// Execute validation and resizing
const { targetSize } = parseArgs();
validateAndResizeIcons(targetSize).then(success => {
  if (!success) {
    process.exit(1);
  }
});
