import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

import {
  AdminProject,
  getPortfolioData,
  ProjectInquirySubmission,
  resetPortfolioData,
  savePortfolioData,
} from "./portfolioData";
import { supabase } from "../lib/supabase";

const inputClass = "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#C3073F]";

type ProjectInquiryRow = {
  id: number | string;
  created_at: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  website_url: string | null;
  business_description: string | null;
  target_audience: string | null;
  project_goals: unknown;
  preferred_websites: string | null;
  brand_assets: string | null;
  content_assets: string | null;
  required_features: unknown;
  budget: string | number | null;
  launch_date: string | null;
  maintenance: string | null;
};

const mapSelections = (value: unknown) => {
  const values: string[] = [];
  let other = "";

  if (!Array.isArray(value)) return { values, other };

  value.forEach((item: unknown) => {
    if (typeof item === "string") {
      values.push(item);
      return;
    }
    if (item && typeof item === "object" && "label" in item && typeof item.label === "string") {
      values.push(item.label);
      if (item.label === "Other" && "detail" in item && typeof item.detail === "string") {
        other = item.detail;
      }
    }
  });

  return { values, other };
};

const mapProjectInquiry = (row: ProjectInquiryRow): ProjectInquirySubmission => {
  const goals = mapSelections(row.project_goals);
  const features = mapSelections(row.required_features);
  return {
    id: String(row.id),
    submittedAt: row.created_at,
    clientDetails: {
      fullName: row.full_name,
      company: row.company_name ?? "",
      email: row.email,
      phone: row.phone ?? "",
      website: row.website_url ?? "",
    },
    projectOverview: {
      businessDescription: row.business_description ?? "",
      audience: row.target_audience ?? "",
      goals: goals.values,
      otherGoal: goals.other,
    },
    designFeatures: {
      inspiration: row.preferred_websites ?? "",
      brandAssets: row.brand_assets ?? "",
      contentProvider: row.content_assets ?? "",
      features: features.values,
      otherFeature: features.other,
    },
    logisticsBudget: {
      budget: row.budget === null ? "" : String(row.budget),
      launchDate: row.launch_date ?? "",
      maintenance: row.maintenance ?? "",
    },
  };
};

const emptyProject = (): AdminProject => ({
  name: "New project",
  description: "Describe this project.",
  tags: [{ name: "react", color: "blue-text-gradient" }],
  image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
  sourceCodeLink: "https://github.com/",
});

const AdminDashboard = () => {
  const [data, setData] = useState(getPortfolioData);
  const [inquiries, setInquiries] = useState<ProjectInquirySubmission[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [inquiriesError, setInquiriesError] = useState("");
  const [saved, setSaved] = useState(false);
  const [lockError, setLockError] = useState("");

  const refreshInquiries = useCallback(async () => {
    if (!supabase) {
      setInquiriesError("Supabase is not configured.");
      setInquiriesLoading(false);
      return;
    }

    setInquiriesLoading(true);
    setInquiriesError("");
    try {
      const { data: rows, error } = await supabase
        .from("project_inquiries")
        .select("id, created_at, full_name, company_name, email, phone, website_url, business_description, target_audience, project_goals, preferred_websites, brand_assets, content_assets, required_features, budget, launch_date, maintenance")
        .order("created_at", { ascending: false })
        .returns<ProjectInquiryRow[]>();
      if (error) throw error;
      setInquiries((rows ?? []).map(mapProjectInquiry));
    } catch (error) {
      setInquiriesError(error instanceof Error ? error.message : "Could not load project requests from Supabase.");
    } finally {
      setInquiriesLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshInquiries();
  }, [refreshInquiries]);

  const save = (event: FormEvent) => {
    event.preventDefault();
    savePortfolioData(data);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const lockAdmin = async () => {
    if (!supabase) {
      window.location.reload();
      return;
    }
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      setLockError(error.message);
      return;
    }
    window.location.reload();
  };

  const updateProject = (index: number, key: keyof AdminProject, value: string) => {
    setData((current) => ({
      ...current,
      projects: current.projects.map((project, projectIndex) =>
        projectIndex === index
          ? key === "tags"
            ? { ...project, tags: value.split(",").map((name) => ({ name: name.trim(), color: "blue-text-gradient" })).filter((tag) => tag.name) }
            : { ...project, [key]: value }
          : project
      ),
    }));
  };

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-10 text-white sm:px-8">
      <form onSubmit={save} className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-[#C3073F]/30 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C3073F]">Portfolio control room</p>
            <h1 className="mt-2 text-3xl font-black">Admin dashboard</h1>
            <p className="mt-2 text-sm text-white/60">Changes are saved only in this browser.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold">View portfolio</Link>
            <button type="button" onClick={() => { void lockAdmin(); }} className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold">Lock</button>
            <button type="submit" className="rounded-lg bg-[#C3073F] px-4 py-2 text-sm font-bold text-white">{saved ? "Saved" : "Save changes"}</button>
          </div>
        </header>
        {lockError && <p className="text-sm text-red-400" role="alert">{lockError}</p>}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-xl font-bold">Hero</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="text-sm">Name<input className={`${inputClass} mt-2`} value={data.hero.name} onChange={(event) => setData({ ...data, hero: { ...data.hero, name: event.target.value } })} /></label>
            <label className="text-sm">First line<input className={`${inputClass} mt-2`} value={data.hero.lines[0] ?? ""} onChange={(event) => setData({ ...data, hero: { ...data.hero, lines: [event.target.value, data.hero.lines[1] ?? ""] } })} /></label>
            <label className="text-sm">Second line<input className={`${inputClass} mt-2`} value={data.hero.lines[1] ?? ""} onChange={(event) => setData({ ...data, hero: { ...data.hero, lines: [data.hero.lines[0] ?? "", event.target.value] } })} /></label>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-xl font-bold">About</h2>
          <label className="mt-4 block text-sm">Introduction<textarea rows={4} className={`${inputClass} mt-2`} value={data.about.content} onChange={(event) => setData({ ...data, about: { ...data.about, content: event.target.value } })} /></label>
        </section>

        <section className="rounded-2xl border border-[#C3073F]/30 bg-[#C3073F]/[0.04] p-5">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C3073F]">Client onboarding</p><h2 className="mt-1 text-xl font-bold">Incoming project requests</h2></div><span className="rounded-full border border-[#C3073F]/40 px-3 py-1 text-xs font-bold text-[#C3073F]">{inquiries.length} request{inquiries.length === 1 ? "" : "s"}</span></div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {inquiriesError ? <p className="text-sm text-red-300" role="alert">Could not load requests from Supabase: {inquiriesError}. Check that your admin account has permission to read this table.</p> : <p className="text-sm text-white/60">{inquiriesLoading ? "Loading project requests…" : inquiries.length === 0 ? "No project requests have been submitted yet." : "Requests loaded from Supabase."}</p>}
            <button type="button" onClick={() => { void refreshInquiries(); }} disabled={inquiriesLoading} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold disabled:opacity-50">{inquiriesLoading ? "Loading…" : "Refresh requests"}</button>
          </div>
          {inquiries.length > 0 && <div className="mt-5 space-y-3">{inquiries.map((inquiry) => <details key={inquiry.id} className="rounded-xl border border-white/10 bg-black/20 p-4"><summary className="cursor-pointer list-none"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-bold">{inquiry.clientDetails.fullName}</p><p className="mt-1 text-sm text-white/60">{inquiry.clientDetails.company} · {inquiry.clientDetails.email}</p></div><span className="text-xs text-white/45">{new Date(inquiry.submittedAt).toLocaleString()}</span></div></summary><div className="mt-5 grid gap-5 border-t border-white/10 pt-5 text-sm text-white/75 sm:grid-cols-2"><div><p className="font-bold text-white">Client details</p><p className="mt-2">Phone: {inquiry.clientDetails.phone}</p>{inquiry.clientDetails.website && <p className="mt-1 break-all">Website: {inquiry.clientDetails.website}</p>}</div><div><p className="font-bold text-white">Project overview</p><p className="mt-2">{inquiry.projectOverview.businessDescription}</p><p className="mt-2">Audience: {inquiry.projectOverview.audience}</p><p className="mt-2">Goals: {inquiry.projectOverview.goals.join(", ")}{inquiry.projectOverview.otherGoal ? ` — ${inquiry.projectOverview.otherGoal}` : ""}</p></div><div><p className="font-bold text-white">Design & features</p><p className="mt-2">Brand assets: {inquiry.designFeatures.brandAssets || "Not specified"}</p><p className="mt-2">Content: {inquiry.designFeatures.contentProvider || "Not specified"}</p><p className="mt-2">Features: {inquiry.designFeatures.features.join(", ") || "Not specified"}{inquiry.designFeatures.otherFeature ? ` — ${inquiry.designFeatures.otherFeature}` : ""}</p></div><div><p className="font-bold text-white">Logistics & budget</p><p className="mt-2">Budget: {inquiry.logisticsBudget.budget || "Not specified"}</p><p className="mt-2">Launch date: {inquiry.logisticsBudget.launchDate || "Not specified"}</p><p className="mt-2">Maintenance: {inquiry.logisticsBudget.maintenance || "Not specified"}</p></div></div></details>)}</div>}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold">Projects</h2><p className="mt-1 text-sm text-white/60">Add, edit, or delete projects. Use public image URLs.</p></div><button type="button" onClick={() => setData({ ...data, projects: [...data.projects, emptyProject()] })} className="rounded-lg border border-[#C3073F] px-3 py-2 text-sm font-bold text-[#950740]">Add project</button></div>
          <div className="mt-5 space-y-5">
            {data.projects.map((project, index) => (
              <article key={`${project.name}-${index}`} className="rounded-xl border border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between"><h3 className="font-bold">Project {index + 1}</h3><button type="button" onClick={() => setData({ ...data, projects: data.projects.filter((_, projectIndex) => projectIndex !== index) })} className="text-sm font-semibold text-red-400">Delete</button></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm">Name<input className={`${inputClass} mt-1`} value={project.name} onChange={(event) => updateProject(index, "name", event.target.value)} /></label>
                  <label className="text-sm">Source URL<input className={`${inputClass} mt-1`} value={project.sourceCodeLink} onChange={(event) => updateProject(index, "sourceCodeLink", event.target.value)} /></label>
                  <label className="text-sm sm:col-span-2">Image URL<input className={`${inputClass} mt-1`} value={project.image} onChange={(event) => updateProject(index, "image", event.target.value)} /></label>
                  <label className="text-sm sm:col-span-2">Description<textarea rows={3} className={`${inputClass} mt-1`} value={project.description} onChange={(event) => updateProject(index, "description", event.target.value)} /></label>
                  <label className="text-sm sm:col-span-2">Tags (comma separated)<input className={`${inputClass} mt-1`} value={project.tags.map((tag) => tag.name).join(", ")} onChange={(event) => updateProject(index, "tags", event.target.value)} /></label>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-xl font-bold">Skills</h2>
          <p className="mt-1 text-sm text-white/60">Edit the labels shown for your existing skill icons.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.technologies.map((technology, index) => <label key={`${technology.name}-${index}`} className="text-sm">Skill {index + 1}<input className={`${inputClass} mt-1`} value={technology.name} onChange={(event) => setData({ ...data, technologies: data.technologies.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item) })} /></label>)}
          </div>
        </section>

        <button type="button" onClick={() => { resetPortfolioData(); setData(getPortfolioData()); }} className="text-sm font-semibold text-white/60 underline underline-offset-4">Reset all local changes</button>
      </form>
    </main>
  );
};

const AdminPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecking, setAuthChecking] = useState(Boolean(supabase));
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setAuthChecking(false);
      return;
    }

    let active = true;
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isPageRefresh = navigation?.type === "reload";
    let lockingAfterRefresh = isPageRefresh;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      if (lockingAfterRefresh && nextSession) return;
      setSession(nextSession);
      setAuthChecking(false);
      setUnlocked(Boolean(nextSession));
    });

    const initializeAuth = isPageRefresh
      ? supabase.auth.signOut({ scope: "local" }).then(({ error: signOutError }) => {
        if (!active) return;
        lockingAfterRefresh = false;
        if (signOutError) setError(`Could not lock the admin session: ${signOutError.message}`);
        setSession(null);
        setUnlocked(false);
        setAuthChecking(false);
      })
      : supabase.auth.getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError) setError(sessionError.message);
        setSession(data.session);
        setUnlocked(Boolean(data.session));
        setAuthChecking(false);
      })
      .catch((sessionError: unknown) => {
        if (!active) return;
        setError(sessionError instanceof Error ? sessionError.message : "Unable to check your Supabase session.");
        setAuthChecking(false);
      });

    initializeAuth.catch((authError: unknown) => {
      if (!active) return;
      lockingAfterRefresh = false;
      setError(authError instanceof Error ? authError.message : "Unable to lock the admin session.");
      setSession(null);
      setUnlocked(false);
      setAuthChecking(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then redeploy.");
      return;
    }

    setWorking(true);
    setError("");
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) throw authError;
      if (!data.session) throw new Error("Sign-in did not return an authenticated session.");
      setSession(data.session);
      setUnlocked(true);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to sign in.");
    } finally {
      setWorking(false);
    }
  };

  if (unlocked && session) return <AdminDashboard />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 text-white">
      <form onSubmit={(event) => void signIn(event)} className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C3073F]">Protected area</p>
        <h1 className="mt-2 text-3xl font-black">Admin login</h1>
        <p className="mt-2 text-sm text-white/60">Sign in with your administrator email and password.</p>
        {authChecking && <p className="mt-5 text-sm text-white/60">Checking secure sign-in…</p>}
        {!authChecking && !supabase && <p className="mt-5 text-sm text-red-300">Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then redeploy.</p>}
        {!authChecking && supabase && (
          <>
            <label className="mt-6 block text-sm font-semibold">
              Admin email
              <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className={`${inputClass} mt-2`} />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Password
              <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className={`${inputClass} mt-2`} />
            </label>
            <button type="submit" disabled={working} className="mt-6 w-full rounded-lg bg-[#C3073F] px-5 py-3 text-sm font-bold text-white hover:bg-[#950740] disabled:cursor-wait disabled:opacity-60">
              {working ? "Signing in…" : "Sign in"}
            </button>
          </>
        )}
        {error && <p className="mt-3 text-sm text-red-400" role="alert">{error}</p>}
        <div className="mt-6"><Link to="/" className="text-sm font-semibold text-white/70 hover:text-white">Back to portfolio</Link></div>
      </form>
    </main>
  );
};

export default AdminPage;
