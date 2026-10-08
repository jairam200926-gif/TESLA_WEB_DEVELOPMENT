import React, { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { EarthCanvas } from "../canvas";
import { SectionWrapper } from "../../hoc";
import { slideIn } from "../../utils/motion";
import { config } from "../../constants/config";
import { Header } from "../atoms/Header";
import { saveContactMessage } from "../../admin/portfolioData";

const INITIAL_STATE = Object.fromEntries(
  Object.keys(config.contact.form).map((input) => [input, ""])
);

const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  accessToken: import.meta.env.VITE_EMAILJS_ACCESS_TOKEN,
};

const Contact = () => {
  const formRef = useRef<React.LegacyRef<HTMLFormElement> | undefined>();
  const [form, setForm] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const showNotification = (message: string) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3800);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined
  ) => {
    if (e === undefined) return;
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | undefined) => {
    if (e === undefined) return;
    e.preventDefault();
    setLoading(true);

    saveContactMessage({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      submittedAt: new Date().toISOString(),
      name: form.name,
      email: form.email,
      message: form.message,
    });

    const isEmailConfigured = Boolean(
      emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.accessToken
    );

    if (!isEmailConfigured) {
      setLoading(false);
      showNotification("Thank you. Your message has been saved and will appear in the admin dashboard.");
      setForm(INITIAL_STATE);
      return;
    }

    emailjs
      .send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          form_name: form.name,
          to_name: config.html.fullName,
          from_email: form.email,
          to_email: config.html.email,
          message: form.message,
        },
        emailjsConfig.accessToken
      )
      .then(
        () => {
          setLoading(false);
          showNotification("Thank you. Your message has been saved and will appear in the admin dashboard.");

          setForm(INITIAL_STATE);
        },
        (error) => {
          setLoading(false);

          console.log(error);
          showNotification("Thank you. Your message has been saved and will appear in the admin dashboard.");
        }
      );
  };

  return (
    <div
      className={`flex flex-col-reverse gap-10 overflow-hidden xl:mt-12 xl:flex-row`}
    >
      <AnimatePresence>
        {notification && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="fixed bottom-5 left-5 right-5 z-[10001] rounded-2xl border border-[#C3073F]/50 bg-[#1A1A1D]/95 px-5 py-4 text-sm font-semibold text-[#F5F5F2] shadow-[0_16px_48px_rgba(0,0,0,.45)] backdrop-blur-xl sm:left-auto sm:right-7 sm:max-w-sm"
          >
            <span className="mr-2 text-[#C3073F]">✓</span>{notification}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="premium-card flex-[0.75] rounded-3xl p-7 sm:p-10"
      >
        <Header useMotion={false} {...config.contact} />

        <form
          // @ts-expect-error
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col gap-8"
        >
          {Object.keys(config.contact.form).map((input) => {
            const { span, placeholder } =
              config.contact.form[input as keyof typeof config.contact.form];
            const Component = input === "message" ? "textarea" : "input";

            return (
              <label key={input} className="flex flex-col">
                <span className="mb-4 font-medium text-white">{span}</span>
                <Component
                  type={input === "email" ? "email" : "text"}
                  name={input}
                  value={form[`${input}`]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="rounded-xl border border-white/10 bg-[#1A1A1D] px-5 py-4 font-medium text-[#F5F5F2] outline-none placeholder:text-[#8D8D8D] focus:border-[#C3073F]"
                  {...(input === "message" && { rows: 7 })}
                />
              </label>
            );
          })}
          <button
            type="submit"
            className="w-fit rounded-full bg-[#C3073F] px-7 py-3.5 font-bold text-[#F5F5F2] outline-none transition-transform hover:-translate-y-1"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="h-[350px] md:h-[550px] xl:h-auto xl:flex-1"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
