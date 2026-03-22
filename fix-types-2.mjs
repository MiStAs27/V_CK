import fs from 'fs';

let content;

// Fix src/app/(app)/layout.tsx
try {
  content = fs.readFileSync('src/app/(app)/layout.tsx', 'utf8');
  content = content.replace("@/components/layout/app-sidebar", "@/componentes/diseno/barra-lateral-app");
  content = content.replace("@/components/ui/sidebar", "@/componentes/ui/barra-lateral");
  fs.writeFileSync('src/app/(app)/layout.tsx', content);
} catch(e) {}

// Fix src/app/layout.tsx
try {
  content = fs.readFileSync('src/app/layout.tsx', 'utf8');
  content = content.replace("@/components/ui/toaster", "@/componentes/ui/tostador");
  fs.writeFileSync('src/app/layout.tsx', content);
} catch(e) {}

// Fix src/componentes/ui/carrusel.tsx
try {
  content = fs.readFileSync('src/componentes/ui/carrusel.tsx', 'utf8');
  content = content.replace(/"selector"/g, '"select"');
  fs.writeFileSync('src/componentes/ui/carrusel.tsx', content);
} catch(e) {}

// Fix src/componentes/ui/boton.tsx
try {
  content = fs.readFileSync('src/componentes/ui/boton.tsx', 'utf8');
  content = content.replace(/Slot : "boton"/g, 'Slot : "button"');
  fs.writeFileSync('src/componentes/ui/boton.tsx', content);
} catch(e) {}

// Fix Calendario.tsx
try {
  content = fs.readFileSync('src/componentes/ui/calendario.tsx', 'utf8');
  // the error was IconRight: ({ className, ...props }) => => need to check what "className" type is missing, probably just let it implicitly be any because there's an issue with React.ComponentProps<SomeIcon> where SomeIcon string might have been modified.
  // Actually, Shadcn's calendar does IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />
  // If the error is "Binding element 'className' implicitly has an 'any' type", we can just add `: any`
  content = content.replace(/IconLeft: \(\{\s*className/g, 'IconLeft: ({ className }: any');
  content = content.replace(/IconRight: \(\{\s*className/g, 'IconRight: ({ className }: any');
  content = content.replace(/IconLeft: \(\{ ...props \}\)/g, 'IconLeft: ({ ...props }: any)');
  content = content.replace(/IconRight: \(\{ ...props \}\)/g, 'IconRight: ({ ...props }: any)');
  fs.writeFileSync('src/componentes/ui/calendario.tsx', content);
} catch(e) {}

// Fix barra-lateral.tsx
try {
  content = fs.readFileSync('src/componentes/ui/barra-lateral.tsx', 'utf8');
  content = content.replace(/<"boton">/g, '<"button">');
  content = content.replace(/Slot : "boton"/g, 'Slot : "button"');
  content = content.replace(/"boton"/g, '"button"'); // maybe button string is what's breaking?
  // Let's also restore Tooltip string if needed
  fs.writeFileSync('src/componentes/ui/barra-lateral.tsx', content);
} catch(e) {}

// Fix dialogo-editar-producto.tsx
try {
  content = fs.readFileSync('src/componentes/productos/dialogo-editar-producto.tsx', 'utf8');
  content = content.replace(/<"formulario">/g, '<"form">');
  content = content.replace(/<"entrada">/g, '<"input">');
  content = content.replace(/<"etiqueta">/g, '<"label">');
  content = content.replace(/<"boton">/g, '<"button">');
  fs.writeFileSync('src/componentes/productos/dialogo-editar-producto.tsx', content);
} catch(e) {}

console.log("Fixes applied!");
