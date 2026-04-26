import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Download } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-20">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-primary text-sm font-medium">Full Stack Developer & AI Enthusiast</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            Hi, I'm <span className="text-primary text-glow">Aman Kumar</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl">
            Java Full Stack Developer crafting modern web experiences with React, Spring Boot, and AI tools.
            Passionate about building intelligent, real-time applications.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href="#contact">
                <Mail className="mr-2 h-5 w-5" />
                Get in Touch
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
              <a href="/Aman_Kumar_Resume.pdf" download>
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </a>
            </Button>
          </div>

          <div className="flex gap-4 pt-4">
            <a
              href="https://github.com/aman73yadav"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-12 h-12 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-all hover:box-glow"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/aman-kumar-yadav"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-12 h-12 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-all hover:box-glow"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://aman73yadav.github.io/Its_me-Profile/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio"
              className="w-12 h-12 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-all hover:box-glow"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative group animate-float">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-primary/30 box-glow">
              <img
                src={profilePhoto}
                alt="Aman Kumar - Full Stack Developer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
