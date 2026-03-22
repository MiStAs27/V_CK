import fs from 'fs';
import path from 'path';

// Load files list
const filesRaw = fs.readFileSync('files.txt', 'utf8');
const files = filesRaw.split('\n').filter(Boolean);

const dictionary = {
  // Routes & folders
  'actions': 'acciones',
  'dashboard': 'tablero',
  'products': 'productos',
  'login': 'iniciar-sesion',
  'components': 'componentes',
  'auth': 'autenticacion',
  'layout': 'diseno',
  'hooks': 'hooks', // keep hooks
  'lib': 'lib',     // keep lib
  'ai': 'ai',
  'flows': 'flujos',
  'ui': 'ui',       // keep ui

  // Utils & hooks
  'use-toast': 'usar-notificacion',
  'use-mobile': 'usar-movil',
  'utils': 'utilidades',
  'types': 'tipos',
  'data': 'datos',
  'dev': 'desarrollo',

  // Complex components
  'login-form': 'formulario-inicio',
  'app-sidebar': 'barra-lateral-app',
  'bestsellers-chart': 'grafico-mas-vendidos',
  'forecast-tool': 'herramienta-pronostico',
  'stats-cards': 'tarjetas-estadisticas',
  'columns': 'columnas',
  'data-table-row-actions': 'acciones-fila-tabla-datos',
  'data-table': 'tabla-datos',
  'edit-product-dialog': 'dialogo-editar-producto',

  // UI Components
  'accordion': 'acordeon',
  'alert-dialog': 'dialogo-alerta',
  'alert': 'alerta',
  'avatar': 'avatar',
  'badge': 'insignia',
  'button': 'boton',
  'calendar': 'calendario',
  'card': 'tarjeta',
  'carousel': 'carrusel',
  'chart': 'grafico',
  'checkbox': 'casilla',
  'collapsible': 'colapsable',
  'dialog': 'dialogo',
  'dropdown-menu': 'menu-desplegable',
  'form': 'formulario',
  'input': 'entrada',
  'label': 'etiqueta',
  'menubar': 'barra-menu',
  'popover': 'popover',
  'progress': 'progreso',
  'radio-group': 'grupo-radio',
  'scroll-area': 'area-desplazamiento',
  'select': 'selector',
  'separator': 'separador',
  'sheet': 'hoja',
  'sidebar': 'barra-lateral',
  'skeleton': 'esqueleto',
  'slider': 'deslizador',
  'switch': 'interruptor',
  'table': 'tabla',
  'tabs': 'pestanas',
  'textarea': 'area-texto',
  'toast': 'brindis',
  'toaster': 'tostador',
  'tooltip': 'informacion-herramienta',
  
  // Ignored or Next.js specific
  'page': 'page',
  'layout': 'layout', // Next app route file, different from components/layout which gets caught because it's a folder, wait. I will map directory names vs file names.
  'globals': 'globals'
};

function translateSegment(segment, isDirectory) {
  let name = segment;
  let ext = '';
  if (!isDirectory) {
    const split = segment.split('.');
    if (split.length > 1) {
      ext = '.' + split.slice(1).join('.');
      name = split[0];
    }
  }

  // Exact match translation
  if (dictionary[name]) {
    name = dictionary[name];
  } else if (dictionary[name.toLowerCase()]) {
    name = dictionary[name.toLowerCase()];
  }
  
  // Hard override for Next.js app directory files:
  if (!isDirectory && ['page', 'layout', 'loading', 'error', 'not-found', 'globals'].includes(name)) {
    // Keep them English (Next.js requirement)
    name = name;
  }
  
  // The 'layout' folder in components should be 'diseno'
  // But this logic assumes we applied the dictionary.
  // We already did above, so name is 'diseno' which is fine. If it's the App Router file 'layout.tsx',
  // we overrode it back to 'layout.tsx'. This is perfect.

  return name + ext;
}

// 1. Build the mapping
const fileMapping = {}; // old file path -> new file path
const dirMapping = {};  // old dir path -> new dir path

for (const filePath of files) {
  const parts = filePath.split('/');
  const newParts = parts.map((part, index) => {
    // Keep 'src' and 'app' at the root
    if (index === 0 && part === 'src') return part;
    if (index === 1 && part === 'app') return part; // Keep standard 'app' App Router root
    if (part === '(app)') return part; // Keep group folders
    
    return translateSegment(part, index < parts.length - 1);
  });
  
  const newPath = newParts.join('/');
  
  if (filePath !== newPath) {
    fileMapping[filePath] = newPath;
  }
}

// 2. Read all contents & apply import updates. 
// We must replace strings in quotes that look like the old parts.
// Actually, an import path is just a string. 
// If we sort the dictionary by length of key (descending), we can replace matches bounded by `/` or quotes.

const translations = Object.keys(dictionary)
  .sort((a, b) => b.length - a.length)
  .map(k => ({
    oldWord: k,
    newWord: dictionary[k]
  }));

function updateContent(content) {
  // We want to replace paths in import/export statements and next/link hrefs.
  // A safe way is to find string literals `...` or '...' and apply replacement inside them.
  let newContent = content.replace(/(["'])(.*?)\1/g, (match, quote, innerString) => {
    // apply string dictionary specifically to path boundaries
    let newInner = innerString;
    const parts = newInner.split('/');
    const translatedParts = parts.map(p => {
      // It might have an extension or be a pure module name
      let base = p;
      let ext = '';
      if (p.includes('.')) {
        const i = p.lastIndexOf('.');
        if (i > 0 && p.substring(i) !== './' && p.substring(i) !== '../') { // Not relative path ./ or ../
           base = p.substring(0, i);
           ext = p.substring(i);
        }
      }
      
      const tr = translations.find(t => t.oldWord === base);
      if (tr) {
        // do not translate if the word is 'layout' but the path does not contain 'components'
        // wait, we handled layout as Next.js file. 
        if (base === 'layout' && innerString.endsWith('layout')) {
           // wait, if it's importing a layout, it's usually `../components/layout/...`
           // if it's importing a Nextjs layout, people rarely do that.
           if (innerString.includes('components')) return tr.newWord + ext;
           return base + ext;
        }
        return tr.newWord + ext;
      }
      return p;
    });
    
    return quote + translatedParts.join('/') + quote;
  });
  
  return newContent;
}

// 3. Process each file: update content, then write to new location
for (const [oldPath, newPath] of Object.entries(fileMapping)) {
  console.log(`Translating: ${oldPath} -> ${newPath}`);
  
  const content = fs.readFileSync(oldPath, 'utf8');
  const updatedContent = updateContent(content);
  
  // ensure directory exists
  const targetDir = path.dirname(newPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // write new file
  fs.writeFileSync(newPath, updatedContent);
  
  // delete old file if we changed directories/names
  if (oldPath !== newPath) {
    fs.rmSync(oldPath);
  }
}

// Clean up empty directories that might be left behind:
function deleteEmptyDirs(dir) {
  try {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      const fullPath = path.join(dir, f);
      if (fs.statSync(fullPath).isDirectory()) {
        deleteEmptyDirs(fullPath);
      }
    }
    // after recursion check again
    if (fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
    }
  } catch (e) {}
}

deleteEmptyDirs('./src');

console.log('Project translation complete!');
