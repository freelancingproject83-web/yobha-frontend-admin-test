import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createCareerJob, updateCareerJob } from "../../service/career";

const defaultForm = {
  jobId: "",
  jobTitle: "",
  department: "",
  jobType: "Full-Time",
  location: {
    city: "",
    state: "",
    country: "",
    remote: false,
  },
  salaryRange: {
    min: "",
    max: "",
    currency: "INR",
  },
  experienceRequired: {
    min: "",
    max: "",
    unit: "years",
  },
  qualification: "",
  skillsRequired: "",
  jobDescription: "",
  responsibilities: "",
  applicationFee: {
    general: "",
  },
  applicationDeadline: "",
  postedBy: {
    name: "",
    email: "",
  },
  status: "Active",
};

const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const normaliseArray = (value) => {
  if (!value) return [];
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildPayload = (state) => ({
  jobId: state.jobId.trim(),
  jobTitle: state.jobTitle.trim(),
  department: state.department.trim(),
  jobType: state.jobType,
  location: {
    city: state.location.city.trim(),
    state: state.location.state.trim(),
    country: state.location.country.trim(),
    remote: Boolean(state.location.remote),
  },
  salaryRange: {
    min: toNumber(state.salaryRange.min),
    max: toNumber(state.salaryRange.max),
    currency: state.salaryRange.currency,
  },
  experienceRequired: {
    min: toNumber(state.experienceRequired.min),
    max: toNumber(state.experienceRequired.max),
    unit: state.experienceRequired.unit,
  },
  qualification: state.qualification.trim(),
  skillsRequired: normaliseArray(state.skillsRequired),
  jobDescription: state.jobDescription.trim(),
  responsibilities: normaliseArray(state.responsibilities),
  applicationFee: {
    general: toNumber(state.applicationFee.general),
  },
  applicationDeadline: state.applicationDeadline
    ? new Date(state.applicationDeadline).toISOString()
    : null,
  postedBy: {
    name: state.postedBy.name.trim(),
    email: state.postedBy.email.trim(),
  },
  status: state.status,
});

const CreateCareerJobPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobFromState = location.state?.job || null;
  const jobIdentifierFromState = location.state?.jobIdentifier || null;
  const mode = location.state?.mode === "edit" && jobFromState ? "edit" : "create";
  const jobIdentifier = useMemo(() => {
    if (mode !== "edit") {
      return null;
    }
    const rawId =
      jobIdentifierFromState ??
      jobFromState?.id ??
      jobFromState?._id?.$oid ??
      jobFromState?._id ??
      jobFromState?.jobId;
    return rawId ? String(rawId) : null;
  }, [jobFromState, jobIdentifierFromState, mode]);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const updateForm = (path, value) => {
    setForm((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const segments = path.split(".");
      let cursor = updated;
      for (let i = 0; i < segments.length - 1; i += 1) {
        cursor = cursor[segments[i]];
      }
      cursor[segments.at(-1)] = value;
      return updated;
    });
  };

  useEffect(() => {
    if (mode === "edit" && jobFromState) {
      const prefilledForm = {
        jobId: jobFromState.jobId ?? "",
        jobTitle: jobFromState.jobTitle ?? "",
        department: jobFromState.department ?? "",
        jobType: jobFromState.jobType ?? "Full-Time",
        location: {
          city: jobFromState.location?.city ?? "",
          state: jobFromState.location?.state ?? "",
          country: jobFromState.location?.country ?? "",
          remote: Boolean(jobFromState.location?.remote),
        },
        salaryRange: {
          min: jobFromState.salaryRange?.min ?? "",
          max: jobFromState.salaryRange?.max ?? "",
          currency: jobFromState.salaryRange?.currency ?? "INR",
        },
        experienceRequired: {
          min: jobFromState.experienceRequired?.min ?? "",
          max: jobFromState.experienceRequired?.max ?? "",
          unit: jobFromState.experienceRequired?.unit ?? "years",
        },
        qualification: jobFromState.qualification ?? "",
        skillsRequired: Array.isArray(jobFromState.skillsRequired)
          ? jobFromState.skillsRequired.join(", ")
          : jobFromState.skillsRequired ?? "",
        jobDescription: jobFromState.jobDescription ?? "",
        responsibilities: Array.isArray(jobFromState.responsibilities)
          ? jobFromState.responsibilities.join("\n")
          : jobFromState.responsibilities ?? "",
        applicationFee: {
          general: jobFromState.applicationFee?.general ?? "",
        },
        applicationDeadline: jobFromState.applicationDeadline
          ? jobFromState.applicationDeadline.substring(0, 16)
          : "",
        postedBy: {
          name: jobFromState.postedBy?.name ?? "",
          email: jobFromState.postedBy?.email ?? "",
        },
        status: jobFromState.status ?? "Active",
      };
      setForm(prefilledForm);
    } else {
      setForm(defaultForm);
    }
  }, [jobFromState, mode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    const payload = buildPayload(form);

    if (!payload.jobId || !payload.jobTitle) {
      setMessage({ type: "error", text: "Job ID and Job Title are required." });
      return;
    }

    if (mode === "edit" && !jobIdentifier) {
      setMessage({ type: "error", text: "Missing job ID for update." });
      return;
    }

    const isUpdate = mode === "edit" && jobIdentifier;
    let requestPayload = payload;

    if (isUpdate && jobIdentifier) {
      requestPayload = {
        ...payload,
        id: jobIdentifier,
      };
    }

    setSubmitting(true);
    try {
      if (isUpdate && jobIdentifier) {
        await updateCareerJob(jobIdentifier, requestPayload);
        setMessage({ type: "success", text: "Job updated successfully." });
      } else {
        const response = await createCareerJob(payload);
        setMessage({
          type: "success",
          text: `Job created successfully with reference ${response?.jobId || response?.id}.`,
        });
        setForm(defaultForm);
      }
    } catch (error) {
      const errorText =
        error.response?.data?.message || error.response?.data?.error || "Failed to create job. Please try again.";
      setMessage({ type: "error", text: errorText });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-light text-black">
            {mode === "edit" ? "Update Career Opportunity" : "Create Career Opportunity"}
          </h1>
          <p className="text-sm text-gray-500">
            {mode === "edit" ? "Modify the selected role details." : "Publish a new role to the Yobha careers portal."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-white border border-gray-300 text-black px-5 py-2 rounded-full text-sm hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>

      {message.text && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-light ${
            {
              success: "border-green-200 bg-green-50 text-green-700",
              error: "border-red-200 bg-red-50 text-red-700",
              info: "border-blue-200 bg-blue-50 text-blue-700",
            }[message.type]
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <header className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-light text-black">Role Overview</h2>
            <p className="text-sm text-gray-500">Core information about the vacancy.</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Job ID *</label>
              <input
                value={form.jobId}
                onChange={(e) => updateForm("jobId", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="JD-001"
                required
                disabled={mode === "edit"}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Job Title *</label>
              <input
                value={form.jobTitle}
                onChange={(e) => updateForm("jobTitle", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="Backend Developer"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Department</label>
              <input
                value={form.department}
                onChange={(e) => updateForm("department", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="Engineering"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Job Type</label>
              <select
                value={form.jobType}
                onChange={(e) => updateForm("jobType", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
              >
                {[
                  "Full-Time",
                  "Part-Time",
                  "Contract",
                  "Internship",
                  "Freelance",
                ].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <header className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-light text-black">Location &amp; Compensation</h2>
            <p className="text-sm text-gray-500">Where the role is based and compensation details.</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">City</label>
              <input
                value={form.location.city}
                onChange={(e) => updateForm("location.city", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="Bangalore"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">State</label>
              <input
                value={form.location.state}
                onChange={(e) => updateForm("location.state", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="Karnataka"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Country</label>
              <input
                value={form.location.country}
                onChange={(e) => updateForm("location.country", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="India"
              />
            </div>
            <div className="flex items-center gap-3 mt-6 md:mt-0">
              <input
                id="remote"
                type="checkbox"
                checked={form.location.remote}
                onChange={(e) => updateForm("location.remote", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <label htmlFor="remote" className="text-sm text-gray-600">
                Remote friendly role
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Salary Min</label>
              <input
                type="number"
                min="0"
                value={form.salaryRange.min}
                onChange={(e) => updateForm("salaryRange.min", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="600000"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Salary Max</label>
              <input
                type="number"
                min="0"
                value={form.salaryRange.max}
                onChange={(e) => updateForm("salaryRange.max", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="1500000"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Currency</label>
              <select
                value={form.salaryRange.currency}
                onChange={(e) => updateForm("salaryRange.currency", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
              >
                {["INR", "USD", "EUR", "GBP", "AED"].map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Experience Min</label>
              <input
                type="number"
                min="0"
                value={form.experienceRequired.min}
                onChange={(e) => updateForm("experienceRequired.min", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Experience Max</label>
              <input
                type="number"
                min="0"
                value={form.experienceRequired.max}
                onChange={(e) => updateForm("experienceRequired.max", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Experience Unit</label>
              <select
                value={form.experienceRequired.unit}
                onChange={(e) => updateForm("experienceRequired.unit", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
              >
                {["years", "months"].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <header className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-light text-black">Role Narrative</h2>
            <p className="text-sm text-gray-500">Describe the role, required skills, and responsibilities.</p>
          </header>
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Qualification</label>
              <input
                value={form.qualification}
                onChange={(e) => updateForm("qualification", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="B.Tech / B.E. in CS"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Key Skills (comma or newline separated)</label>
              <textarea
                rows={3}
                value={form.skillsRequired}
                onChange={(e) => updateForm("skillsRequired", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="C#, .NET, MongoDB"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Job Description</label>
              <textarea
                rows={4}
                value={form.jobDescription}
                onChange={(e) => updateForm("jobDescription", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="Describe the opportunity"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Responsibilities (one per line)</label>
              <textarea
                rows={4}
                value={form.responsibilities}
                onChange={(e) => updateForm("responsibilities", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder={`Design REST APIs\nIntegrate services`}
              />
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <header className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-light text-black">Application &amp; Publishing</h2>
            <p className="text-sm text-gray-500">Set fees, deadline and contact details.</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Application Fee (General)</label>
              <input
                type="number"
                min="0"
                value={form.applicationFee.general}
                onChange={(e) => updateForm("applicationFee.general", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Application Deadline</label>
              <input
                type="datetime-local"
                value={form.applicationDeadline}
                onChange={(e) => updateForm("applicationDeadline", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateForm("status", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
              >
                {["Active", "Draft", "Closed"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Posted By Name</label>
              <input
                value={form.postedBy.name}
                onChange={(e) => updateForm("postedBy.name", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="HR Manager"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Posted By Email</label>
              <input
                type="email"
                value={form.postedBy.email}
                onChange={(e) => updateForm("postedBy.email", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                placeholder="hr@yobha.com"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-8 py-3 rounded-full text-sm tracking-wide hover:bg-gray-900 transition-colors disabled:opacity-60"
          >
            {submitting ? (mode === "edit" ? "Saving..." : "Publishing...") : mode === "edit" ? "Save Changes" : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCareerJobPage;


