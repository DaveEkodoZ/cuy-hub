import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import cuyLogo from "@/assets/cuy-logo.png";

const PageTransition = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setVisible(true);
    setFadeOut(false);
    const t1 = setTimeout(() => setFadeOut(true), 600);
    const t2 = setTimeout(() => setVisible(false), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-400 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="relative flex flex-col items-center gap-4 animate-scale-in">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl animate-pulse" />
          <img
            src={cuyLogo}
            alt="CUY"
            className="relative h-36 w-36 rounded-3xl object-contain drop-shadow-2xl"
          />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-primary tracking-wide">UrbaLink</h2>
          <p className="text-xs text-muted-foreground">Communauté Urbaine de Yaoundé</p>
        </div>
        <div className="mt-2 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              style={{
                animation: "bounce 1s ease-in-out infinite",
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageTransition;
