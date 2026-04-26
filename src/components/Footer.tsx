import { Github, Linkedin, Mail, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Aman Kumar. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a
              href="https://github.com/aman73yadav"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-all"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/aman-kumar-yadav"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-all"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://aman73yadav.github.io/Its_me-Profile/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Original Portfolio"
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-all"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a
              href="mailto:amankumar2000683@gmail.com"
              aria-label="Email"
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-all"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
