import fs from 'fs';
import path from 'path';

const srcDir = './src';
const files = [];

function walkDir(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else {
      files.push(filePath);
    }
  }
}

walkDir(srcDir);

const revertMap = {
  'entrada': 'input',
  'boton': 'button',
  'etiqueta': 'label',
  'area-texto': 'textarea',
  'formulario': 'form',
  'tabla': 'table',
  'dialogo': 'dialog',
  'selector': 'select',
  'ui': 'ui', // not needed but just in case
};

for (const filePath of files) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // We are looking to revert stuff like ComponentProps<"entrada">
  // Also forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"entrada">>
  // Also ElementRef<"entrada">
  // We can just look for `<"X">` and `<'X'>` where X is in revertMap
  for (const [es, en] of Object.entries(revertMap)) {
    const regex1 = new RegExp(`<"${es}">`, 'g');
    const regex2 = new RegExp(`<\\'${es}\\'>`, 'g');
    
    if (regex1.test(content) || regex2.test(content)) {
      content = content.replace(regex1, `<"${en}">`);
      content = content.replace(regex2, `<'${en}'>`);
      changed = true;
    }
    
    // Also consider primitive type imports from radix-ui that were translated
    // like import * as SelectPrimitive from "@radix-ui/react-selector" if it happened.
    // Let's check if the radix paths were broken: "@radix-ui/react-dialog" -> "@radix-ui/react-dialogo"
    const regex3 = new RegExp(`@radix-ui/react-${es}["']`, 'g');
    if (regex3.test(content)) {
      content = content.replace(regex3, `@radix-ui/react-${en}"`);
      changed = true;
    }
    
    // Check for `typeof X` or other places where primitive strings matter.
    // e.g., asChild
    // But let's keep it safe.
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed types in ${filePath}`);
  }
}
