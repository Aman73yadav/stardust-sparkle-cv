import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FolderGit2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";

const Projects = () => {
  const { projects, loading } = useProjects();

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

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-muted-foreground">No projects yet — add some from the admin dashboard.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:box-glow group flex flex-col"
              >
                <div className="aspect-video w-full bg-muted overflow-hidden flex items-center justify-center">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <FolderGit2 className="h-12 w-12 text-muted-foreground/50" />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 flex-1">{project.description}</p>

                  {project.tech.length > 0 && (
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
                  )}

                  <div className="flex gap-3">
                    {project.code_url && (
                      <Button asChild variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                        <a href={project.code_url} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.demo_url && (
                      <Button asChild variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

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
