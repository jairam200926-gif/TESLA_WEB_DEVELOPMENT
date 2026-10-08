import { useEffect, useState } from "react";

import { config } from "../constants/config";
import { projects, services, technologies } from "../constants";

export type AdminProject = (typeof projects)[number];
export type AdminService = (typeof services)[number];
export type AdminTechnology = (typeof technologies)[number];

export type PortfolioData = {
  hero: { name: string; lines: string[] };
  about: { content: string; services: AdminService[] };
  technologies: AdminTechnology[];
  projects: AdminProject[];
};

const STORAGE_KEY = "twd-portfolio-admin";
const INQUIRIES_STORAGE_KEY = "twd-portfolio-project-inquiries";
const CONTACT_MESSAGES_STORAGE_KEY = "twd-portfolio-contact-messages";

export type ProjectInquirySubmission = {
  id: string;
  submittedAt: string;
  clientDetails: { fullName: string; company: string; email: string; phone: string; website: string };
  projectOverview: { businessDescription: string; audience: string; goals: string[]; otherGoal: string };
  designFeatures: { inspiration: string; brandAssets: string; contentProvider: string; features: string[]; otherFeature: string };
  logisticsBudget: { budget: string; launchDate: string; maintenance: string };
};

export type ContactMessage = {
  id: string;
  submittedAt: string;
  name: string;
  email: string;
  message: string;
};

const defaults = (): PortfolioData => ({
  hero: { name: config.hero.name, lines: [...config.hero.p] },
  about: { content: config.sections.about.content, services: [...services] },
  technologies: [...technologies],
  projects: [...projects],
});

export const getPortfolioData = (): PortfolioData => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults();

    const base = defaults();
    const saved = JSON.parse(stored) as Partial<PortfolioData>;
    return {
      ...base,
      ...saved,
      hero: { ...base.hero, ...saved.hero },
      about: { ...base.about, ...saved.about },
      technologies: saved.technologies ?? base.technologies,
      projects: (() => {
        const savedProjects = (saved.projects ?? []).filter(
          (project) => project.name.trim() && project.name !== "New project"
        );
        const defaultNames = new Set(base.projects.map((project) => project.name));
        const updatedDefaults = base.projects.map((project) => ({
          ...project,
          ...savedProjects.find((savedProject) => savedProject.name === project.name),
        }));
        const customProjects = savedProjects.filter(
          (project) => !defaultNames.has(project.name)
        );
        return [...updatedDefaults, ...customProjects];
      })(),
    };
  } catch {
    return defaults();
  }
};

export const savePortfolioData = (data: PortfolioData) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("portfolio-admin-change"));
};

export const resetPortfolioData = () => {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("portfolio-admin-change"));
};

export const getProjectInquiries = (): ProjectInquirySubmission[] => {
  try {
    const saved = window.localStorage.getItem(INQUIRIES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveProjectInquiry = (inquiry: ProjectInquirySubmission) => {
  const inquiries = getProjectInquiries();
  window.localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify([inquiry, ...inquiries]));
  window.dispatchEvent(new Event("project-inquiries-change"));
};

export const getContactMessages = (): ContactMessage[] => {
  try {
    const saved = window.localStorage.getItem(CONTACT_MESSAGES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveContactMessage = (message: ContactMessage) => {
  const messages = getContactMessages();
  window.localStorage.setItem(CONTACT_MESSAGES_STORAGE_KEY, JSON.stringify([message, ...messages]));
  window.dispatchEvent(new Event("contact-messages-change"));
};

export const deleteContactMessage = (messageId: string) => {
  const messages = getContactMessages().filter((message) => message.id !== messageId);
  window.localStorage.setItem(CONTACT_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  window.dispatchEvent(new Event("contact-messages-change"));
};

export const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData>(getPortfolioData);

  useEffect(() => {
    const refresh = () => setData(getPortfolioData());
    window.addEventListener("portfolio-admin-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("portfolio-admin-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return data;
};
