import { AppSidebar } from '@/componentes/diseno/barra-lateral-app';
import { SidebarProvider, SidebarInset } from '@/componentes/ui/barra-lateral';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
