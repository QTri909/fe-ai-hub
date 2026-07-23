const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'requirements', 'RequirementsPage.tsx');
let c = fs.readFileSync(filePath, 'utf8');
let lines = c.split('\n');

let fixedPreconditions = false;
let fixedExpectedResult = false;

// Find and fix PRECONDITIONS header
for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim();
  if (trimmed === 'PRECONDITIONS') {
    // Line i is "PRECONDITIONS"
    // Line i-1 should be the <h5 ...> opening tag
    // Line i+1 should be </h5>
    if (lines[i-1] && lines[i-1].includes('<h5')) {
      // Fix the h5 line to add flex classes
      lines[i-1] = lines[i-1].replace(
        'tracking-wider">',
        'tracking-wider flex items-center justify-between">'
      );
      // Replace PRECONDITIONS with span
      lines[i] = lines[i].replace('PRECONDITIONS', '<span>PRECONDITIONS</span>');
      // Insert Edit3 button before </h5>
      const indent = lines[i+1] ? lines[i+1].match(/^\s*/)[0] : '                                    ';
      lines.splice(i+1, 0, indent + '<button onClick={(e) => { e.stopPropagation(); openEditModal(tc, "precondition"); }} className="text-slate-400 hover:text-indigo-400 transition p-1"><Edit3 size={13} /></button>');
      fixedPreconditions = true;
      console.log('Fixed PRECONDITIONS at line', i+1);
      break;
    }
  }
}

// Find and fix EXPECTED RESULT header
for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim();
  if (trimmed === 'EXPECTED RESULT') {
    if (lines[i-1] && lines[i-1].includes('<h5')) {
      lines[i-1] = lines[i-1].replace(
        'tracking-wider">',
        'tracking-wider flex items-center justify-between">'
      );
      lines[i] = lines[i].replace('EXPECTED RESULT', '<span>EXPECTED RESULT</span>');
      const indent = lines[i+1] ? lines[i+1].match(/^\s*/)[0] : '                                    ';
      lines.splice(i+1, 0, indent + '<button onClick={(e) => { e.stopPropagation(); openEditModal(tc, "expectedResult"); }} className="text-slate-400 hover:text-indigo-400 transition p-1"><Edit3 size={13} /></button>');
      fixedExpectedResult = true;
      console.log('Fixed EXPECTED RESULT at line', i+1);
      break;
    }
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Preconditions fixed:', fixedPreconditions);
console.log('Expected Result fixed:', fixedExpectedResult);
</arg_value>
<task_progress>
- [x] Verify Edit buttons exist in file
- [x] Fix Edit buttons in PRECONDITIONS & EXPECTED RESULT headers
- [ ] Test the implementation compiles
</task_progress>
</write_to_file>