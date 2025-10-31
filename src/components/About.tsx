import { Card } from "@/components/ui/card";
import { GraduationCap, Briefcase, Award, FolderGit2 } from "lucide-react";

const About = () => {
  const stats = [
    { icon: GraduationCap, label: "Education", value: "M.Tech Data Science" },
    { icon: Briefcase, label: "Experience", value: "Full Stack Developer" },
    { icon: Award, label: "Certifications", value: "9+" },
    { icon: FolderGit2, label: "Projects", value: "10+" },
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-primary">Me</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Passionate developer combining creativity with technical expertise
          </p>
        </div>

        {/* Stats Grid */}
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
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Currently pursuing an M.Tech in Data Science with a 100% scholarship, I am passionate about 
            leveraging technology to solve real-world challenges. My journey combines a strong foundation 
            in Full Stack Development with advanced expertise in Machine Learning and AI.
          </p>
          <p>
            As a certified Java Full Stack Developer, I have hands-on experience with Java, Spring Boot, 
            React.js, Node.js, and Python. My technical toolkit spans across both frontend and backend 
            technologies, enabling me to build comprehensive solutions from concept to deployment.
          </p>
          <p>
            I am particularly drawn to projects that integrate AI and automation, as demonstrated by my 
            work on innovative solutions. I'm eager to contribute to cutting-edge projects where 
            data-driven insights meet elegant software design.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
