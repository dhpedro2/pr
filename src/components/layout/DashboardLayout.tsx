import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, CreditCard, BarChart3, User, Settings, HelpCircle, LogOut } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-card border-r border-border">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold tracking-tight">PR <span className="text-primary">Radiadores</span></h1>
          <p className="text-sm text-muted-foreground mt-1">Painel Financeiro</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem icon={<Home size={18} />} href="#" isActive>
            Painel
          </NavItem>
          <NavItem icon={<CreditCard size={18} />} href="#">
            Transações
          </NavItem>
          <NavItem icon={<BarChart3 size={18} />} href="#">
            Relatórios
          </NavItem>
          <NavItem icon={<User size={18} />} href="#">
            Perfil
          </NavItem>
          <NavItem icon={<Settings size={18} />} href="#">
            Configurações
          </NavItem>
        </nav>
        
        <div className="mt-auto px-4 py-4 border-t border-border">
          <NavItem icon={<HelpCircle size={18} />} href="#">
            Ajuda & Suporte
          </NavItem>
          <NavItem icon={<LogOut size={18} />} href="#">
            Sair
          </NavItem>
        </div>
      </aside>
      
      {/* Mobile header */}
      <div className="md:hidden fixed inset-x-0 top-0 z-50 bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">PR <span className="text-primary">Radiadores</span></h1>
          <Button variant="outline" size="icon">
            <Home size={18} />
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0">
        <div className="container py-6 md:py-10 px-4 md:px-6 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavItem = ({ href, icon, children, isActive }: NavItemProps) => {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {icon && <span>{icon}</span>}
      {children}
    </a>
  );
};

export default DashboardLayout;
