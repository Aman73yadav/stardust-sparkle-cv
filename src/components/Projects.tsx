import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "AI-Powered Chat Application",
      description: "Full-stack chat application with AI integration for smart responses and sentiment analysis.",
      tech: ["React", "Node.js", "OpenAI", "MongoDB"],
    },
    {
      title: "E-Commerce Platform",
      description: "Complete e-commerce solution with payment integration, inventory management, and analytics.",
      tech: ["Spring Boot", "React", "MySQL", "Stripe"],
    },
    {
      title: "Machine Learning Pipeline",
      description: "Automated ML pipeline for data preprocessing, model training, and deployment.",
      tech: ["Python", "TensorFlow", "Docker", "AWS"],
    },
    {
      title: "Task Management System",
      description: "Collaborative task management with real-time updates and team collaboration features.",
      tech: ["React", "Express", "PostgreSQL", "Socket.io"],
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
            Showcasing innovative solutions across full-stack development and AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:box-glow group"
            >
              <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              
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
                <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                  <Github className="mr-2 h-4 w-4" />
                  Code
                </Button>
                <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Demo
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
