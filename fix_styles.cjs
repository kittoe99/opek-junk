const fs = require('fs');
const path = require('path');

const files = [
  'components/QuotePage.tsx',
  'components/BookingPage.tsx',
  'components/ZipCheckModal.tsx',
  'components/FullServiceSection.tsx'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Input groups styling (AI prompts, zips, etc)
  content = content.replace(/bg-secondary-50\/50 border-2 border-secondary-100 hover:border-secondary-300 focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand\/10/g,
    'bg-white border border-secondary-200 hover:border-brand focus-within:border-brand focus-within:ring-1 focus-within:ring-brand');
    
  content = content.replace(/bg-white border-2 border-secondary-100 hover:border-secondary-300 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand\/10/g,
    'bg-white border border-secondary-200 hover:border-brand focus-within:border-brand focus-within:ring-1 focus-within:ring-brand');

  // Moving Labor buttons styling in QuotePage
  content = content.replace(/p-5 border-2 rounded-none/g, 'p-5 border border-secondary-200 rounded-none');
  
  content = content.replace(/border-brand bg-brand\/5 ring-4 ring-brand\/10 shadow-\[0_0_20px_rgba\(255,0,110,0\.05\)\]/g,
    'border-brand bg-white ring-1 ring-brand shadow-[0_0_15px_rgba(255,0,110,0.05)]');
    
  content = content.replace(/border-secondary-100 bg-white hover:border-brand\/50 hover:bg-secondary-50/g,
    'border-secondary-200 bg-white hover:border-brand');
    
  content = content.replace(/bg-secondary-50 text-secondary-400 group-hover:bg-brand\/10 group-hover:text-brand/g,
    'bg-transparent text-secondary-400 group-hover:text-brand');
    
  content = content.replace(/w-5 h-5 border-2 rounded-none/g, 'w-5 h-5 border border-secondary-200 rounded-none');
  content = content.replace(/border-secondary-200 bg-white group-hover:border-brand\/50/g, 'border-secondary-200 bg-white group-hover:border-brand');

  content = content.replace(/w-4 h-4 border-2 rounded-none/g, 'w-4 h-4 border border-secondary-200 rounded-none');

  // Moving Labor Estimated Hours styling
  content = content.replace(/p-5 bg-white border-2 border-secondary-100 rounded-none gap-4 transition-all focus-within:border-brand focus-within:ring-4 focus-within:ring-brand\/10/g,
    'p-5 bg-white border border-secondary-200 rounded-none gap-4 transition-all focus-within:border-brand focus-within:ring-1 focus-within:ring-brand');
    
  content = content.replace(/w-10 h-10 bg-secondary-50/g, 'w-10 h-10 bg-transparent');
  
  content = content.replace(/bg-secondary-50 border-2 border-secondary-100 rounded-none p-1/g,
    'bg-white border border-secondary-200 rounded-none p-1');
    
  content = content.replace(/border-2 border-transparent/g, 'border border-transparent');

  // Manual junk entry styling
  content = content.replace(/w-full md:border border-secondary-100 hover:border-brand hover:bg-brand\/5 transition-all p-6/g,
    'w-full md:border border-secondary-200 hover:border-brand transition-all p-6 bg-white');
    
  content = content.replace(/bg-secondary-50 border border-secondary-100 rounded-lg text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary\/10/g,
    'bg-white border border-secondary-200 rounded-none text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand');

  content = content.replace(/w-12 h-12 bg-secondary-50 group-hover:bg-brand\/10 border border-secondary-100 group-hover:border-brand\/20/g,
    'w-12 h-12 bg-white border border-secondary-200 group-hover:border-brand');
    
  // QuotePage generic forms grey backgrounds
  content = content.replace(/bg-secondary-50 rounded-2xl p-5 md:p-6 border border-secondary-100/g,
    'bg-white rounded-none p-5 md:p-6 border border-secondary-200');
    
  content = content.replace(/bg-secondary-50\/50 border border-secondary-100 p-4 rounded-2xl/g,
    'bg-white border border-secondary-200 p-4 rounded-none');
    
  content = content.replace(/border border-secondary-100 rounded-none bg-secondary-50\/30 p-4 md:p-5/g,
    'border border-secondary-200 rounded-none bg-white p-4 md:p-5');
    
  content = content.replace(/bg-secondary-50\/50/g, 'bg-white');
  
  // Make sure we also get rid of other bg-secondary-50 occurrences where they are container backgrounds
  content = content.replace(/bg-secondary-50/g, 'bg-white');

  // Booking Page fields
  content = content.replace(/bg-white border border-secondary-100 focus:ring-2 focus:ring-brand\/20 focus:border-brand/g,
    'bg-white border border-secondary-200 focus:ring-1 focus:ring-brand focus:border-brand');
    
  // FullServiceSection success banner
  content = content.replace(/bg-green-50 border-2 border-green-500/g, 'bg-white border border-green-500');

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log("Done");
