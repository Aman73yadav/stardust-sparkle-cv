import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get("name");
    const email = data.get("email");
    const subject = data.get("subject") || "Hello from your portfolio";
    const message = data.get("message");
    const body = `Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
    window.location.href = `mailto:amankumar2000683@gmail.com?subject=${encodeURIComponent(
      String(subject)
    )}&body=${body}`;
  };

  return (
    <section id="contact" className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get in <span className="text-primary">Touch</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Open to full stack, AI, and software engineering opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Mail, title: "Email", value: "amankumar2000683@gmail.com", href: "mailto:amankumar2000683@gmail.com" },
            { icon: Phone, title: "Phone", value: "+91 98356 24373", href: "tel:+919835624373" },
            { icon: MapPin, title: "Location", value: "Muzaffarpur, Bihar, India", href: "#" },
          ].map((item, index) => (
            <a key={index} href={item.href} className="block">
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:box-glow text-center h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground break-words">{item.value}</p>
              </Card>
            </a>
          ))}
        </div>

        <Card className="p-8 bg-card border-border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input name="name" required placeholder="Your name" className="bg-background border-border" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input name="email" type="email" required placeholder="your@email.com" className="bg-background border-border" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input name="subject" placeholder="How can I help you?" className="bg-background border-border" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                name="message"
                required
                placeholder="Tell me about your project..."
                rows={6}
                className="bg-background border-border"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default Contact;
