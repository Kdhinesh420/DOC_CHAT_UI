const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.resolve(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      if (fullPath.endsWith('.jsx')) results.push(fullPath);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/bg-dark-bg/g, 'bg-app-bg');
  content = content.replace(/bg-dark-card/g, 'bg-app-card');
  
  content = content.replace(/border-white\/10/g, 'border-app-line');
  content = content.replace(/border-white\/5/g, 'border-app-line-soft');
  
  content = content.replace(/hover:bg-white\/5/g, 'hover:bg-app-hover');
  content = content.replace(/hover:bg-white\/10/g, 'hover:bg-app-line');
  
  content = content.replace(/bg-white\/5/g, 'bg-app-hover');
  content = content.replace(/bg-white\/10/g, 'bg-app-line');
  content = content.replace(/bg-white\/20/g, 'bg-app-line-strong');
  
  content = content.replace(/text-white/g, 'text-text-main');

  // Fix buttons that need to remain white
  content = content.replace(/bg-primary([^"']*)text-text-main/g, 'bg-primary$1text-white');
  content = content.replace(/bg-gradient-to-r([^"']*)text-text-main/g, 'bg-gradient-to-r$1text-white');
  content = content.replace(/bg-gradient-to-br([^"']*)text-text-main/g, 'bg-gradient-to-br$1text-white');

  fs.writeFileSync(file, content);
});
