import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Settings } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin } = useAuth();
  const { profilePhotoUrl } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : ""
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#home" className="text-2xl font-bold flex items-center gap-3">
          <img
            src={profilePhotoUrl}
            alt=""
            className="w-9 h-9 rounded-full object-cover border border-primary/40"
          />
          <span>
            <span className="text-primary">Aman</span> Kumar
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              {item.name}
            </a>
          ))}
          {user && isAdmin && (
            <Button asChild variant="outline" size="sm" className="border-primary/50">
              <Link to="/admin">
                <Settings className="mr-2 h-4 w-4" /> Admin
              </Link>
            </Button>
          )}
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <a href="#contact">Let's Talk</a>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
