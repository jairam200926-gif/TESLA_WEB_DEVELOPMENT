type TSection = {
  p: string;
  h2: string;
  content?: string;
};

type TConfig = {
  html: {
    title: string;
    fullName: string;
    email: string;
  };
  hero: {
    name: string;
    p: string[];
  };
  contact: {
    form: {
      name: {
        span: string;
        placeholder: string;
      };
      email: {
        span: string;
        placeholder: string;
      };
      message: {
        span: string;
        placeholder: string;
      };
    };
  } & TSection;
  sections: {
    about: Required<TSection>;
    experience: TSection;
    works: Required<TSection>;
  };
};

export const config: TConfig = {
  html: {
    title: "TESLA WEB DEVELOPMENT — Jai rg",
    fullName: "Jai rg",
    email: "jairg@gmail.com",
  },
  hero: {
    name: "Jai rg",
    p: ["Data Science Student • Python Developer • Builder", "Turning ideas into practical software with Python, data science, web development, and AI-powered applications."],
  },
  contact: {
    p: "Get in touch",
    h2: "Contact.",
    form: {
      name: {
        span: "Your Name",
        placeholder: "What's your name?",
      },
      email: { span: "Your Email", placeholder: "What's your email?" },
      message: {
        span: "Your Message",
        placeholder: "What do you want to say?",
      },
    },
  },
  sections: {
    about: {
      p: "Introduction",
      h2: "Overview.",
      content: `I'm Jai rg, a Data Science student at VIT Vellore passionate about coding, data, AI, and problem solving. I learn by building real projects and continuously improving the technologies I use to solve real-world problems. My approach is simple: build, break, improve, and build again.`,
    },
    experience: {
      p: "Journey",
      h2: "Experience.",
    },
    works: {
      p: "My Work",
      h2: "Projects.",
      content: `A selection of practical products spanning market analytics, fintech, and AI. Each project is built to turn a useful idea into a clear, working experience.`,
    },
  },
};
