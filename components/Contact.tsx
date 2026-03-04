import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactPayload } from "@/lib/api/contact";
import { useContactQuery } from "@/hooks/useContactQuery";
import { useEffect } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });
  const [request, setRequest] = useState<{
    id: number;
    payload: ContactPayload;
  } | null>(null);
  const { isFetching, isSuccess, isError, error } = useContactQuery(request);

  useEffect(() => {
    if (isSuccess && request) {
      setStatus({
        type: "success",
        message: "Message sent successfully. I will get notified by email/SMS.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setRequest(null);
    }
  }, [isSuccess, request]);

  useEffect(() => {
    if (isError) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send your message right now.",
      });
      setRequest(null);
    }
  }, [isError, error]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });
    setRequest({
      id: Date.now(),
      payload: formData,
    });
  };

  return (
    <section id="contact" className="container mx-auto px-6 py-24 md:px-10 lg:px-16">
      <div className="grid md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-6 text-4xl font-bold sm:text-5xl">
            Let&apos;s connect <br />
            <span className="text-primary">and build.</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            I am currently working as an Associate Software Developer (Frontend)
            and open to meaningful frontend opportunities.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-card text-accent">
                <MapPin />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium text-lg">Bengaluru, India</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-card text-accent">
                <Mail />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium text-lg">souravgokul4@gmail.com</div>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <a
                href="https://www.linkedin.com/in/souravgokul11"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit LinkedIn profile"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Linkedin size={20} />
              </a>
              <div>
                <div className="text-sm text-muted-foreground">LinkedIn</div>
                <a
                  href="https://www.linkedin.com/in/souravgokul11"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="font-medium text-lg hover:underline">
                    www.linkedin.com/in/souravgokul11
                  </div>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border/70 bg-card/30 p-8 backdrop-blur-sm"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Your name"
                  className="border-border/70 bg-background/50 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Email</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="your@email.com"
                  className="border-border/70 bg-background/50 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Subject</label>
              <Input
                required
                value={formData.subject}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    subject: event.target.value,
                  }))
                }
                placeholder="Collaboration or role"
                className="border-border/70 bg-background/50 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Message</label>
              <Textarea
                required
                value={formData.message}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    message: event.target.value,
                  }))
                }
                placeholder="Share your requirement..."
                className="min-h-40 resize-none border-border/70 bg-background/50 focus:border-primary"
              />
            </div>

            {status.type !== "idle" && (
              <p
                className={
                  status.type === "success"
                    ? "text-green-400 text-sm"
                    : "text-red-400 text-sm"
                }
              >
                {status.message}
              </p>
            )}

            <Button
              size="lg"
              className="w-full"
              type="submit"
              disabled={isFetching}
            >
              {isFetching ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
