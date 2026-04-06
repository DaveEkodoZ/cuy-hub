import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock } from "lucide-react";
import cuyLogo from "@/assets/cuy-logo.png";
import yaoundeBg from "@/assets/yaounde-bg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate auth
    await new Promise((r) => setTimeout(r, 1200));
    
    if (email && password) {
      toast({ title: "✅ Connexion réussie", description: "Bienvenue sur UrbaLink" });
      navigate("/dashboard");
    } else {
      toast({ title: "❌ Accès refusé", description: "Identifiants incorrects", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        src={yaoundeBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 gradient-login opacity-85" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="rounded-xl bg-card p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <img src={cuyLogo} alt="Logo CUY" className="mb-4 h-20 w-auto" />
            <h1 className="text-xl font-bold text-foreground">Communauté Urbaine de Yaoundé</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Plateforme interne – <span className="font-semibold text-primary">UrbaLink</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@cuy.cm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours…
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Communauté Urbaine de Yaoundé — Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
