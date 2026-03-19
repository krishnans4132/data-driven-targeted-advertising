const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

let totalReplacements = 0;

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let modified = false;

  // We want to force a bright green color: #4ade80 (Tailwind green-400)
  const replaceRegex = /<Tooltip([\s\S]*?)(\/?>)/g;
  
  content = content.replace(replaceRegex, (match, props, closing) => {
    // If it already has our green color, skip to avoid double injecting
    if (props.includes('#4ade80')) return match;

    modified = true;
    totalReplacements++;
    
    // Remove any existing inline itemStyle or labelStyle to avoid conflicts
    let cleanProps = props.replace(/itemStyle=\{[^}]+\}/g, '').replace(/labelStyle=\{[^}]+\}/g, '');
    
    return `<Tooltip itemStyle={{ color: '#4ade80', fontWeight: 600 }} labelStyle={{ color: '#4ade80', fontWeight: 'bold' }}${cleanProps}${closing}`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated Tooltips in ${file}`);
  }
});
console.log(`Tooltip script completed. ${totalReplacements} instances modified.`);
