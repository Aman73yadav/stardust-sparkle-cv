import { Card } from "@/components/ui/card";
import { GraduationCap, Briefcase, Award, FolderGit2 } from "lucide-react";

const About = () => {
  const stats = [
    { icon: GraduationCap, label: "Education", value: "B.Tech EEE" },
    { icon: Briefcase, label: "Role", value: "Java Full Stack" },
    { icon: Award, label: "Certifications", value: "4+" },
    { icon: FolderGit2, label: "Projects", value: "5+" },
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-primary">Me</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Full Stack Developer blending Java backend expertise with modern AI tools
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:box-glow group"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
          <p>
            I'm <span className="text-foreground font-semibold">Aman Kumar</span>, a Java Full Stack Developer
            from Muzaffarpur, Bihar. I graduated in Electrical and Electronics Engineering from BP Mandal
            College of Engineering (Aryabhatta Knowledge University, Patna) in 2022, and pivoted into
            software with a Java Full Stack certification from JSpiders Bangalore.
          </p>
          <p>
            My toolkit spans <span className="text-primary">Java, Spring Boot, Hibernate, J2EE</span> on the
            backend and <span className="text-primary">React.js, JavaScript, HTML, CSS, Tailwind</span> on
            the frontend. I also work with <span className="text-primary">Python, Machine Learning,
            and modern AI tools</span> like Google Gemini and Supabase real-time services to build smart,
            data-driven applications.
          </p>
          <p>
            I'm passionate about writing clean, maintainable code, learning new technologies, and shipping
            products that combine strong engineering with AI-powered intelligence.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
