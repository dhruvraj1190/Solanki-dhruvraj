import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const zip = new JSZip();

function addDirectoryToZip(dirPath, zipFolder) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const subFolder = zipFolder.folder(item);
      addDirectoryToZip(fullPath, subFolder);
    } else {
      const content = fs.readFileSync(fullPath);
      zipFolder.file(item, content);
    }
  }
}

async function createZip() {
  const javaDir = path.resolve('java');
  const rootFolder = zip.folder('emergency-road-planner');
  addDirectoryToZip(javaDir, rootFolder);

  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  // Write to root
  fs.writeFileSync('emergency-road-planner-java.zip', content);
  console.log('Created /emergency-road-planner-java.zip (size: ' + content.length + ' bytes)');

  // Ensure public exists and write to public so it is served statically
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }
  fs.writeFileSync('public/emergency-road-planner-java.zip', content);
  console.log('Created /public/emergency-road-planner-java.zip (size: ' + content.length + ' bytes)');
}

createZip().catch(err => {
  console.error('Error creating zip:', err);
  process.exit(1);
});
