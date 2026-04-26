import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "Smart Greenhouse Monitoring System",
      description:
        "Real-time greenhouse dashboard with live sensor streaming via Supabase WebSockets (<2s latency), an interactive 3D digital twin built with Three.js & React Three Fiber, and Google Gemini AI for plant disease detection from leaf images. Google OAuth, protected routes, deployed on Vercel with 99.8% uptime.",
      tech: ["React.js", "Tailwind", "Three.js", "Supabase", "Gemini AI", "Vercel"],
      demo: "#",
      code: "https://github.com/aman73yadav",
    },
    {
      title: "Personal Portfolio Website",
      description:
        "My original developer portfolio showcasing skills, education, certifications and projects with a clean, responsive layout hosted on GitHub Pages.",
      tech: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      demo: "https://aman73yadav.github.io/Its_me-Profile/",
      code: "https://github.com/aman73yadav/Its_me-Profile",
    },
    {
      title: "Web Application using Maven",
      description:
        "Java web application built with Maven covering REST controllers, service & DAO layers, and full JUnit test coverage for DTOs, services and controllers. Hands-on software analysis, programming, testing and debugging.",
      tech: ["Java", "Spring Boot", "Maven", "REST", "JUnit", "Hibernate"],
      demo: "#",
      code: "https://github.com/aman73yadav",
    },
    {
      title: "Java Full Stack Mini Projects",
      description:
        "Collection of full stack exercises from JSpiders Bangalore training: CRUD apps with Spring MVC + Hibernate + MySQL backends and React/JSP frontends.",
      tech: ["Java", "Spring MVC", "Hibernate", "MySQL", "JSP"],
      demo: "#",
      code: "https://github.com/aman73yadav",
    },
  ];

  return (
    <section id="projects" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Real-world work across full stack development and AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:box-glow group flex flex-col"
            >
              <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground mb-4 flex-1">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded border border-primary/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <Button asChild variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                  <a href={project.code} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Demo
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-primary/50 hover:bg-primary/10">
            <a href="https://aman73yadav.github.io/Its_me-Profile/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View My Original Portfolio
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
