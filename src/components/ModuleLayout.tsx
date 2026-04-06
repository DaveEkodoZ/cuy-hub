import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { LucideIcon, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface ModuleLayoutProps {
  title: string;
  sidebarItems: SidebarItem[];
  children: ReactNode;
}

const ModuleLayout = ({ title, sidebarItems, children }: ModuleLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 border-r bg-sidebar md:block">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-sm font-semibold text-sidebar-foreground">{title}</h2>
          </div>
          <nav className="space-y-1 p-3">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent font-medium text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default ModuleLayout;
