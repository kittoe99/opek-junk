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

  // 1. Focus-within wrappers (ZIP inputs, AI inputs)
  const pattern1 = /bg-white border border-secondary-200 hover:border-brand focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/g;
  if (pattern1.test(content)) {
    content = content.replace(pattern1, 'bg-white border border-secondary-100 hover:border-brand/40 hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 focus-within:shadow-[0_4px_20px_rgba(255,0,110,0.15)] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300');
    changed = true;
  }

  // 2. Standard inputs (Booking details, Contact, etc)
  // Matching: bg-white border border-secondary-200 ... focus:ring-1 focus:ring-brand focus:border-brand
  const pattern2 = /bg-white border border-secondary-200( rounded-[a-z]+) text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand/g;
  if (pattern2.test(content)) {
    content = content.replace(pattern2, 'bg-white border border-secondary-100$1 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300');
    changed = true;
  }

  // 3. Provider Signup input
  const pattern3 = /bg-white border border-secondary-200 rounded-xl text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand focus:bg-white transition-all duration-200/g;
  if (pattern3.test(content)) {
    content = content.replace(pattern3, 'bg-white border border-secondary-100 rounded-xl text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-brand/40 hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] focus:bg-white transition-all duration-300');
    changed = true;
  }
  
  // 4. Moving Labor Selection Cards
  const pattern4 = /group p-5 border border-secondary-200 rounded-none/g;
  if (pattern4.test(content)) {
    content = content.replace(pattern4, 'group p-5 border border-secondary-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(255,0,110,0.12)] hover:border-brand/40 rounded-none');
    changed = true;
  }
  
  // Moving Labor Checkbox borders
  const pattern5 = /border border-secondary-200 rounded-none flex items-center/g;
  if (pattern5.test(content)) {
    content = content.replace(pattern5, 'border border-secondary-100 rounded-none flex items-center shadow-sm group-hover:border-brand/40');
    changed = true;
  }

  // Moving Labor specific active states
  const pattern6 = /border-secondary-200 bg-white hover:border-brand/g;
  if (pattern6.test(content)) {
    content = content.replace(pattern6, 'border-secondary-100 bg-white hover:border-brand/40 hover:shadow-[0_8px_30px_rgba(255,0,110,0.12)]');
    changed = true;
  }

  // General `border border-secondary-200` to `border-secondary-100` fallback for forms/containers
  // Wait, I only want to target specific things so I don't break dividers.
  const pattern7 = /border border-secondary-200 rounded-none bg-white p-4/g;
  if (pattern7.test(content)) {
    content = content.replace(pattern7, 'border border-secondary-100 shadow-sm rounded-none bg-white p-4');
    changed = true;
  }
  
  // Manual text input
  const pattern8 = /bg-white border border-secondary-200 rounded-none text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/g;
  if (pattern8.test(content)) {
    content = content.replace(pattern8, 'bg-white border border-secondary-100 rounded-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated", filePath);
  }
}
console.log("Done");
