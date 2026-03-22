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

const dictionary = {
  'actions': 'acciones',
  'dashboard': 'tablero',
  'products': 'productos',
  'login': 'iniciar-sesion',
  'components': 'componentes',
  'auth': 'autenticacion',
  'login-form': 'formulario-inicio',
  'bestsellers-chart': 'grafico-mas-vendidos',
  'forecast-tool': 'herramienta-pronostico',
  'stats-cards': 'tarjetas-estadisticas',
  'layout': 'diseno', // or just layout, let's keep layout as is perhaps? no the user asked for translated names
  'app-sidebar': 'barra-lateral-app',
  'columns': 'columnas',
  'data-table-row-actions': 'acciones-fila-tabla-datos',
  'data-table': 'tabla-datos',
  'edit-product-dialog': 'dialogo-editar-producto',
  'hooks': 'ganchos', // maybe 'hooks' is better, but user asked for translation. "hooks" is technically standard. Let's use 'hooks' or 'utilidades-react' 
  'use-mobile': 'usar-movil',
  'use-toast': 'usar-brindis', // use-toast -> usar-notificacion
  'lib': 'biblio', // lib -> utilidades
  'utils': 'utilidades',
  'ai': 'ia',
  'flows': 'flujos',
  'sales-forecast-explanation-flow': 'flujo-explicacion-pronostico-ventas',
  'genkit': 'genkit',
  'dev': 'desarrollo',
  'ui': 'ui',
  'page': 'page', // Keep Next.js special files as they are (page.tsx, layout.tsx, globals.css)
  'layout': 'layout', 
  'globals': 'globals'
};

const mapping = {};

for (const oldPath of files) {
  const parts = oldPath.split(path.sep);
  const newParts = parts.map(part => {
    const ext = path.extname(part);
    const name = path.basename(part, ext);
    let newName = name;
    
    // Apply dictionary translations
    if (dictionary[name]) {
      newName = dictionary[name];
    } else if (dictionary[name.toLowerCase()]) {
      newName = dictionary[name.toLowerCase()];
    }
    
    // Handle specific corrections
    if (name === 'hooks') newName = 'hooks'; // maybe keep standard folder names? The user said "los nombres de los archivos". I will translate folders too to be safe, except Next.js specific things.
    if (name === 'use-toast') newName = 'usar-notificacion';
    if (name === 'lib') newName = 'lib'; // keep lib
    if (name === 'components') newName = 'componentes';
    if (name === 'app') newName = 'app'; // Keep 'app' because it's the Next.js App Router root!
    if (name === '(app)') newName = '(app)'; // Keep route groups
    
    return newName + ext;
  });
  
  const newPath = newParts.join(path.sep);
  if (oldPath !== newPath) {
    mapping[oldPath] = newPath;
  }
}

fs.writeFileSync('mapping.json', JSON.stringify(mapping, null, 2));
console.log('Mapping generated in mapping.json');
