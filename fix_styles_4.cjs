const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath, fileList);
    } else if (filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = walk(path.join(__dirname, 'components'));

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace all border-secondary-200 with border-secondary-100 to make them lighter
  if (content.includes('border-secondary-200')) {
    content = content.replace(/border-secondary-200/g, 'border-secondary-100');
    changed = true;
  }
  
  // Make inputs more attractive
  // Look for text inputs: bg-white border border-secondary-100 ... focus:outline-none
  // We'll replace the static transition-colors with transition-all duration-300 and add shadows
  const inputPattern = /focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors/g;
  if (inputPattern.test(content)) {
    content = content.replace(inputPattern, 'focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand/60 focus:shadow-[0_4px_20px_rgba(255,0,110,0.12)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 transition-all duration-300');
    changed = true;
  }

  // Same for QuotePage inputs that already had transition-all duration-300 but need better shadows/focus
  const quotePattern = /focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/g;
  if (quotePattern.test(content)) {
    content = content.replace(quotePattern, 'focus:outline-none focus:border-brand/60 focus:ring-4 focus:ring-brand/10 focus:shadow-[0_4px_20px_rgba(255,0,110,0.12)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 transition-all duration-300');
    changed = true;
  }
  
  // Buttons that used to have border-secondary-200 text-secondary hover:border-brand hover:text-brand transition-colors
  const btnPattern = /border-secondary-100 text-secondary hover:border-brand hover:text-brand transition-colors/g;
  if (btnPattern.test(content)) {
    content = content.replace(btnPattern, 'border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated", filePath);
  }
}
console.log("Done");
