const fs = require('fs');
const path = require('path');

const files = [
  'components/ProviderSignupPage.tsx',
  'components/BookingDetailsForm.tsx',
  'components/ContactPage.tsx',
  'components/InHomeEstimatePage.tsx',
  'components/TrackOrderPage.tsx'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Common text input replacements
  content = content.replace(/bg-secondary-50\/50 border border-secondary-100/g,
    'bg-white border border-secondary-200');
    
  content = content.replace(/bg-secondary-50 border border-secondary-100/g,
    'bg-white border border-secondary-200');

  // Focus rings updates for text inputs to be "light and attractive"
  content = content.replace(/focus:ring-2 focus:ring-brand\/10/g, 'focus:ring-1 focus:ring-brand');
  content = content.replace(/focus:ring-2 focus:ring-brand\/20/g, 'focus:ring-1 focus:ring-brand');

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log("Done");
