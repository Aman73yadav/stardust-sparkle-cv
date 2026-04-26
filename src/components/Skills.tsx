import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: ["React.js", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Three.js"],
    },
    {
      title: "Backend Development",
      skills: ["Java", "Spring Boot", "J2EE", "Hibernate", "Spring MVC", "REST APIs", "JUnit"],
    },
    {
      title: "AI / ML & Data",
      skills: ["Python", "Machine Learning", "Google Gemini AI", "Data Structures", "Problem Solving"],
    },
    {
      title: "Database & Tools",
      skills: ["MySQL", "Supabase", "JDBC", "Git", "GitHub", "Maven", "Vercel"],
    },
  ];

  return (
    <section id="skills" className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="text-primary">Skills</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Java backend, modern frontend, and AI tooling
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {skillCategories.map((category, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:box-glow"
            >
              <h3 className="text-xl font-semibold mb-4 text-primary">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-foreground border border-primary/30"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
