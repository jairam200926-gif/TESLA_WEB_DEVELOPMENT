import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { supabase } from "../../lib/supabase";

type InquiryData = {
  clientDetails: { fullName: string; company: string; email: string; phone: string; website: string };
  projectOverview: { businessDescription: string; audience: string; goals: string[]; otherGoal: string };
  designFeatures: { inspiration: string; brandAssets: string; contentProvider: string; features: string[]; otherFeature: string };
  logisticsBudget: { budget: string; launchDate: string; maintenance: string };
};

const initialData: InquiryData = {
  clientDetails: { fullName: "", company: "", email: "", phone: "", website: "" },
  projectOverview: { businessDescription: "", audience: "", goals: [], otherGoal: "" },
  designFeatures: { inspiration: "", brandAssets: "", contentProvider: "", features: [], otherFeature: "" },
  logisticsBudget: { budget: "", launchDate: "", maintenance: "" },
};

const steps = ["Client & Business Details", "Project Overview", "Design & Features", "Logistics & Budget"];
const goalOptions = ["Generate leads / inquiries", "Sell products online (E-commerce)", "Build brand awareness", "Provide information / showcase portfolio", "Other"];
const featureOptions = ["Contact / Inquiry Form", "Booking / Scheduling System", "Online Store / Payment Gateway", "Blog / News Section", "User Login / Membership Area", "Other"];

const Field = ({ label, required, children, error }: { label: string; required?: boolean; children: React.ReactNode; error?: string }) => (
  <label className="block text-sm font-semibold text-[#F5F5F2]">
    {label}{required && <span className="ml-1 text-[#C3073F]">*</span>}
    <div className="mt-2">{children}</div>
    {error && <p className="mt-1 text-xs text-[#ff6b8f]">{error}</p>}
  </label>
);

const inputClass = "w-full rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-[#F5F5F2] outline-none transition placeholder:text-white/35 focus:border-[#C3073F] focus:ring-2 focus:ring-[#C3073F]/20";

const ProjectInquiry = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<InquiryData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", escape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", escape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const title = useMemo(() => steps[step], [step]);
  const update = <Section extends keyof InquiryData, Key extends keyof InquiryData[Section]>(section: Section, key: Key, value: InquiryData[Section][Key]) => {
    setData((current) => ({ ...current, [section]: { ...current[section], [key]: value } }));
  };
  const toggle = (section: "projectOverview" | "designFeatures", key: "goals" | "features", value: string) => {
    if (section === "projectOverview" && key === "goals") {
      const values = data.projectOverview.goals;
      update("projectOverview", "goals", values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
      return;
    }
    const values = data.designFeatures.features;
    update("designFeatures", "features", values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (step === 0) {
      const client = data.clientDetails;
      if (!client.fullName.trim()) nextErrors.fullName = "Please enter your full name.";
      if (!client.company.trim()) nextErrors.company = "Please enter your company or organization name.";
      if (!/^\S+@\S+\.\S+$/.test(client.email)) nextErrors.email = "Enter a valid email address.";
      if (!/^[+()\-\s\d]{7,}$/.test(client.phone)) nextErrors.phone = "Enter a valid phone number.";
      if (client.website && !/^https?:\/\//.test(client.website)) nextErrors.website = "Include http:// or https:// in the URL.";
    }
    if (step === 1) {
      if (!data.projectOverview.businessDescription.trim()) nextErrors.businessDescription = "Tell me a little about your business.";
      if (!data.projectOverview.audience.trim()) nextErrors.audience = "Please describe your target audience.";
      if (!data.projectOverview.goals.length) nextErrors.goals = "Choose at least one primary goal.";
      if (data.projectOverview.goals.includes("Other") && !data.projectOverview.otherGoal.trim()) nextErrors.otherGoal = "Please specify the other goal.";
    }
    if (step === 2 && data.designFeatures.features.includes("Other") && !data.designFeatures.otherFeature.trim()) nextErrors.otherFeature = "Please specify the other feature.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitProjectRequest = async () => {
    if (submittingRef.current || !validate()) return;

    setSubmissionError("");
    submittingRef.current = true;
    setSubmitting(true);

    try {
      if (!supabase) {
        throw new Error("Project inquiries are not configured yet. Please try again shortly.");
      }

      const { error } = await supabase.from("project_inquiries").insert({
        full_name: data.clientDetails.fullName.trim(),
        company_name: data.clientDetails.company.trim() || null,
        email: data.clientDetails.email.trim(),
        phone: data.clientDetails.phone.trim() || null,
        website_url: data.clientDetails.website.trim() || null,
        business_description: data.projectOverview.businessDescription.trim() || null,
        target_audience: data.projectOverview.audience.trim() || null,
        project_goals: data.projectOverview.goals.map((goal) => (
          goal === "Other" && data.projectOverview.otherGoal.trim()
            ? { label: goal, detail: data.projectOverview.otherGoal.trim() }
            : { label: goal }
        )),
        preferred_websites: data.designFeatures.inspiration.trim() || null,
        brand_assets: data.designFeatures.brandAssets || null,
        content_assets: data.designFeatures.contentProvider || null,
        required_features: data.designFeatures.features.map((feature) => (
          feature === "Other" && data.designFeatures.otherFeature.trim()
            ? { label: feature, detail: data.designFeatures.otherFeature.trim() }
            : { label: feature }
        )),
        budget: data.logisticsBudget.budget || null,
        launch_date: data.logisticsBudget.launchDate || null,
        maintenance: data.logisticsBudget.maintenance || null,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Unable to submit your request. Please try again.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const next = () => {
    if (!validate()) return;
    if (step < 3) setStep((current) => current + 1);
    else void submitProjectRequest();
  };

  const resetAndClose = () => {
    setStep(0);
    setErrors({});
    setSubmitted(false);
    setSubmissionError("");
    submittingRef.current = false;
    setSubmitting(false);
    setData(initialData);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#09090a]/90 p-3 backdrop-blur-xl sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="project-inquiry-title">
          <motion.div className="relative flex max-h-[94svh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(145deg,rgba(78,78,80,.72),rgba(26,26,29,.96)_38%,rgba(45,18,29,.9))] shadow-[0_28px_100px_rgba(0,0,0,.65),0_0_60px_rgba(195,7,63,.18)]" initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 28, scale: 0.98 }} transition={{ type: "spring", damping: 28, stiffness: 260 }}>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8 sm:py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C3073F]">Project Inquiry</p>
                <p className="mt-1 text-sm text-[#C8C8C8]">Tell me about your project</p>
              </div>
              <button type="button" onClick={resetAndClose} className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-xl text-[#F5F5F2] transition hover:border-[#C3073F] hover:text-[#C3073F]" aria-label="Close project inquiry">×</button>
            </div>

            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center sm:px-16">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-[#C3073F]/60 bg-[#C3073F]/15 text-3xl text-[#C3073F]">✓</span>
                <h2 id="project-inquiry-title" className="mt-7 text-3xl font-bold text-[#F5F5F2] sm:text-5xl">Project request received</h2>
                <p className="mt-5 max-w-md leading-7 text-[#C8C8C8]">Thank you for sharing your project requirements. I&apos;ll review the details and get back to you.</p>
                <button type="button" onClick={resetAndClose} className="mt-9 rounded-full bg-[#C3073F] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#950740]">Back to portfolio</button>
              </div>
            ) : (
              <>
                <div className="px-5 pt-5 sm:px-8 sm:pt-7">
                  <div className="flex items-center justify-between text-xs font-bold tracking-[0.14em] text-[#C8C8C8]"><span>STEP {step + 1} / 4</span><span>{Math.round(((step + 1) / 4) * 100)}%</span></div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full rounded-full bg-[#C3073F]" animate={{ width: `${((step + 1) / 4) * 100}%` }} transition={{ duration: 0.35 }} /></div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-8">
                  <AnimatePresence mode="wait">
                    <motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }}>
                      <h2 id="project-inquiry-title" className="text-2xl font-bold text-[#F5F5F2] sm:text-3xl">{title}</h2>
                      {step === 0 && <div className="mt-7 grid gap-5 sm:grid-cols-2">
                        <Field label="Full Name" required error={errors.fullName}><input autoFocus value={data.clientDetails.fullName} onChange={(event) => update("clientDetails", "fullName", event.target.value)} className={inputClass} placeholder="Your full name" /></Field>
                        <Field label="Company / Organization Name" required error={errors.company}><input value={data.clientDetails.company} onChange={(event) => update("clientDetails", "company", event.target.value)} className={inputClass} placeholder="Company name" /></Field>
                        <Field label="Email Address" required error={errors.email}><input type="email" value={data.clientDetails.email} onChange={(event) => update("clientDetails", "email", event.target.value)} className={inputClass} placeholder="name@company.com" /></Field>
                        <Field label="Phone Number" required error={errors.phone}><input type="tel" value={data.clientDetails.phone} onChange={(event) => update("clientDetails", "phone", event.target.value)} className={inputClass} placeholder="+91 00000 00000" /></Field>
                        <div className="sm:col-span-2"><Field label="Current Website URL" error={errors.website}><input type="url" value={data.clientDetails.website} onChange={(event) => update("clientDetails", "website", event.target.value)} className={inputClass} placeholder="https://example.com" /></Field></div>
                      </div>}
                      {step === 1 && <div className="mt-7 space-y-6">
                        <Field label="Describe your business and what you do in a few sentences" required error={errors.businessDescription}><textarea value={data.projectOverview.businessDescription} onChange={(event) => update("projectOverview", "businessDescription", event.target.value)} className={`${inputClass} min-h-[110px] resize-y`} placeholder="Tell me about your business..." /></Field>
                        <Field label="Who is your target audience or ideal customer?" required error={errors.audience}><textarea value={data.projectOverview.audience} onChange={(event) => update("projectOverview", "audience", event.target.value)} className={`${inputClass} min-h-[90px] resize-y`} placeholder="Who do you want to reach?" /></Field>
                        <fieldset><legend className="text-sm font-semibold text-[#F5F5F2]">What is the primary goal of this new website?<span className="ml-1 text-[#C3073F]">*</span></legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{goalOptions.map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-[#C8C8C8] transition hover:border-[#C3073F]/60"><input type="checkbox" checked={data.projectOverview.goals.includes(option)} onChange={() => toggle("projectOverview", "goals", option)} className="accent-[#C3073F]" />{option}</label>)}</div>{errors.goals && <p className="mt-2 text-xs text-[#ff6b8f]">{errors.goals}</p>}</fieldset>
                        {data.projectOverview.goals.includes("Other") && <Field label="Please specify" required error={errors.otherGoal}><input value={data.projectOverview.otherGoal} onChange={(event) => update("projectOverview", "otherGoal", event.target.value)} className={inputClass} placeholder="Describe your goal" /></Field>}
                      </div>}
                      {step === 2 && <div className="mt-7 space-y-6">
                        <Field label="List 2–3 websites you like and explain what you like about them"><textarea value={data.designFeatures.inspiration} onChange={(event) => update("designFeatures", "inspiration", event.target.value)} className={`${inputClass} min-h-[100px] resize-y`} placeholder="Website links and what you like about them..." /></Field>
                        <fieldset><legend className="text-sm font-semibold text-[#F5F5F2]">Do you have existing brand assets?</legend><div className="mt-3 space-y-2">{["Yes, we have a logo, brand colors, and guidelines", "We have a logo, but need help with the rest", "No, we need full branding/logo design"].map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-[#C8C8C8]"><input type="radio" name="brandAssets" value={option} checked={data.designFeatures.brandAssets === option} onChange={(event) => update("designFeatures", "brandAssets", event.target.value)} className="accent-[#C3073F]" />{option}</label>)}</div></fieldset>
                        <fieldset><legend className="text-sm font-semibold text-[#F5F5F2]">Who will provide the text and images for the website?</legend><div className="mt-3 space-y-2">{["I have all copy and images ready", "I will write the copy but need stock images", "I need professional copywriting and image sourcing"].map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-[#C8C8C8]"><input type="radio" name="contentProvider" value={option} checked={data.designFeatures.contentProvider === option} onChange={(event) => update("designFeatures", "contentProvider", event.target.value)} className="accent-[#C3073F]" />{option}</label>)}</div></fieldset>
                        <fieldset><legend className="text-sm font-semibold text-[#F5F5F2]">What specific features does the website need?</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{featureOptions.map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-[#C8C8C8]"><input type="checkbox" checked={data.designFeatures.features.includes(option)} onChange={() => toggle("designFeatures", "features", option)} className="accent-[#C3073F]" />{option}</label>)}</div></fieldset>
                        {data.designFeatures.features.includes("Other") && <Field label="Please specify" required error={errors.otherFeature}><input value={data.designFeatures.otherFeature} onChange={(event) => update("designFeatures", "otherFeature", event.target.value)} className={inputClass} placeholder="Describe the feature" /></Field>}
                      </div>}
                      {step === 3 && <div className="mt-7 space-y-6">
                        <fieldset><legend className="text-sm font-semibold text-[#F5F5F2]">What is your estimated budget for this project?</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{["Under $1,000", "$1,000 – $3,000", "$3,000 – $5,000", "$5,000+"].map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-[#C8C8C8]"><input type="radio" name="budget" value={option} checked={data.logisticsBudget.budget === option} onChange={(event) => update("logisticsBudget", "budget", event.target.value)} className="accent-[#C3073F]" />{option}</label>)}</div></fieldset>
                        <Field label="What is your target launch date?"><input type="date" value={data.logisticsBudget.launchDate} onChange={(event) => update("logisticsBudget", "launchDate", event.target.value)} className={inputClass} /></Field>
                        <fieldset><legend className="text-sm font-semibold text-[#F5F5F2]">Will you need ongoing website maintenance and updates after launch?</legend><div className="mt-3 space-y-2">{["Yes, I want a monthly maintenance plan", "No, I want to manage it myself", "I'm not sure yet"].map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-[#C8C8C8]"><input type="radio" name="maintenance" value={option} checked={data.logisticsBudget.maintenance === option} onChange={(event) => update("logisticsBudget", "maintenance", event.target.value)} className="accent-[#C3073F]" />{option}</label>)}</div></fieldset>
                      </div>}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="border-t border-white/10 px-5 py-4 sm:px-8 sm:py-5">
                  {submissionError && <p className="mb-3 text-sm font-medium text-[#ff6b8f]" role="alert">{submissionError}</p>}
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => { setErrors({}); setStep((current) => Math.max(0, current - 1)); }} disabled={step === 0 || submitting} className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold text-[#F5F5F2] transition disabled:cursor-not-allowed disabled:opacity-35 hover:border-[#C3073F]">Back</button>
                    <button type="button" onClick={next} disabled={submitting} className="rounded-full bg-[#C3073F] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#950740] disabled:cursor-not-allowed disabled:opacity-60">{step === 3 ? (submitting ? "Submitting..." : "Submit project request") : "Next"}</button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectInquiry;
