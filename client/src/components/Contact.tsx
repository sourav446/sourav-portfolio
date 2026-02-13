import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Twitter, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <section id="contact" className="py-24 container mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold mb-6">Let's work <br /><span className="text-primary">together.</span></h2>
          <p className="text-xl text-muted-foreground mb-12">
            I'm currently available for freelance projects and open to new opportunities. 
            If you have a project in mind or just want to say hi, feel free to reach out!
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-white/10 text-accent">
                <Mail />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium text-lg">sourav.gokul@example.com</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-white/10 text-accent">
                <MapPin />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium text-lg">Bangalore, India</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-12">
            {[Github, Linkedin, Twitter].map((Icon, i) => (
              <a 
                key={i}
                href="#"
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-card/30 backdrop-blur-sm border border-white/10 p-8 rounded-2xl"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Name</label>
                <Input placeholder="John Doe" className="bg-background/50 border-white/10 focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Email</label>
                <Input placeholder="john@example.com" className="bg-background/50 border-white/10 focus:border-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Subject</label>
              <Input placeholder="Project Inquiry" className="bg-background/50 border-white/10 focus:border-primary" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Message</label>
              <Textarea placeholder="Tell me about your project..." className="min-h-[150px] bg-background/50 border-white/10 focus:border-primary resize-none" />
            </div>

            <Button size="lg" className="w-full">
              Send Message
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
