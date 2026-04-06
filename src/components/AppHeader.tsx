import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Bell } from "lucide-react";
import cuyLogo from "@/assets/cuy-logo.png";

const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-6 shadow-card">
      {/* Left */}
      <div
        className="flex cursor-pointer items-center gap-3"
        onClick={() => navigate("/dashboard")}
      >
        <img src={cuyLogo} alt="Logo CUY" className="h-10 w-auto" />
        <div className="hidden sm:block">
          <p className="text-sm font-bold leading-tight text-foreground">UrbaLink</p>
          <p className="text-xs text-muted-foreground">Communauté Urbaine de Yaoundé</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            3
          </span>
        </Button>

        <div className="hidden items-center gap-2 md:flex">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="text-sm font-medium leading-tight text-foreground">Admin CUY</p>
            <p className="text-xs text-muted-foreground">Administrateur</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          title="Déconnexion"
        >
          <LogOut className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
