import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Edit2, Trash2, RefreshCw, Plus, MapPin, Users } from "lucide-react";
import { deleteCareerJob, getCareerJobs, getCareerApplicants, updateApplicantStatus } from "../../service/career";

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "Active" },
  { label: "Draft", value: "Draft" },
  { label: "Closed", value: "Closed" },
];

const CareerJobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [activeTab, setActiveTab] = useState("Jobs");

  // Applicants state
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState("");
  const [applicantsJobTitle, setApplicantsJobTitle] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const totalPages = useMemo(() => {
    if (!total || !limit) return 0;
    return Math.ceil(total / limit);
  }, [total, limit]);
  const [updatingApplicantId, setUpdatingApplicantId] = useState(null);
  const APPLICANT_STATUS_OPTIONS = ["New", "Reviewed", "Shortlisted", "Rejected", "Hired", "On Hold"];

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const params = statusFilter ? { status: statusFilter } : {};
      const data = await getCareerJobs(params);
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : data?.items || [];
      setJobs(list);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const loadApplicants = async () => {
    try {
      setApplicantsLoading(true);
      setApplicantsError("");
      const params = {
        jobTitle: applicantsJobTitle || undefined,
        page,
        limit,
      };
      const data = await getCareerApplicants(params);
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];
      const totalItems =
        typeof data?.total === "number"
          ? data.total
          : typeof data?.count === "number"
          ? data.count
          : typeof data?.totalItems === "number"
          ? data.totalItems
          : Array.isArray(list)
          ? list.length
          : 0;
      setApplicants(list);
      setTotal(totalItems);
    } catch (err) {
      setApplicants([]);
      setTotal(0);
      setApplicantsError(err.response?.data?.message || err.message || "Failed to fetch applicants");
    } finally {
      setApplicantsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Applicants") {
      loadApplicants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, limit]);

  const handleApplicantsSearch = (e) => {
    e.preventDefault();
    setPage(0);
    loadApplicants();
  };

  const handleDelete = async (job) => {
    const rawId = job?.id ?? job?._id?.$oid ?? job?._id ?? job?.jobId;
    if (!rawId) {
      alert("Unable to delete job: missing job identifier.");
      return;
    }
    const identifier = String(rawId);
    const confirmed = window.confirm(`Delete job ${job.jobTitle || job.jobId || identifier}? This cannot be undone.`);
    if (!confirmed) return;
    try {
      setDeleteLoading(identifier);
      await deleteCareerJob(identifier);
      setJobs((prev) =>
        prev.filter((item) => {
          const itemRawId = item?.id ?? item?._id?.$oid ?? item?._id ?? item?.jobId;
          return String(itemRawId) !== identifier;
        })
      );
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Unable to delete job";
      alert(errMsg);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (job) => {
    const rawId = job?.id ?? job?._id?.$oid ?? job?._id ?? job?.jobId;
    if (!rawId) {
      alert("Unable to edit job: missing job identifier.");
      return;
    }
    const identifier = String(rawId);
    navigate("/career/create", { state: { mode: "edit", job, jobIdentifier: identifier } });
  };

  const renderHeader = () => (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#f7f1de] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#58471c]">
          <Briefcase size={14} /> Careers
        </div>
        <h1 className="text-3xl font-light text-black">Career Opportunities</h1>
        <p className="text-sm text-gray-500">Manage all open and archived roles.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={loadJobs}
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50"
        >
          <RefreshCw size={16} /> Refresh
        </button>
        <button
          type="button"
          onClick={() => navigate("/career/create")}
          className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm text-white hover:bg-gray-900"
        >
          <Plus size={16} /> New Job
        </button>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-gray-600">
        Displaying <strong>{jobs.length}</strong> job{jobs.length === 1 ? "" : "s"}
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600" htmlFor="status-filter">
          Status
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="bg-white border border-gray-200 rounded-3xl p-2 flex items-center gap-2">
      <button
        type="button"
        onClick={() => setActiveTab("Jobs")}
        className={`flex-1 rounded-2xl px-4 py-2 text-sm ${activeTab === "Jobs" ? "bg-black text-white" : "bg-transparent text-black hover:bg-gray-50"}`}
      >
        Jobs
      </button>
      <button
        type="button"
        onClick={() => setActiveTab("Applicants")}
        className={`flex-1 rounded-2xl px-4 py-2 text-sm ${activeTab === "Applicants" ? "bg-black text-white" : "bg-transparent text-black hover:bg-gray-50"}`}
      >
        Applicants
      </button>
    </div>
  );

  const renderApplicantsFilters = () => (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <form onSubmit={handleApplicantsSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          <label className="text-sm text-gray-600" htmlFor="applicants-jobtitle">
            Job Title
          </label>
          <input
            id="applicants-jobtitle"
            value={applicantsJobTitle}
            onChange={(e) => setApplicantsJobTitle(e.target.value)}
            placeholder="Frontend"
            className="rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black w-full sm:w-64"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 w-full sm:w-auto"
          >
            <RefreshCw size={16} /> Apply
          </button>
        </form>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600" htmlFor="limit">
            Per Page
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => {
              const v = Number(e.target.value);
              setLimit(v);
              setPage(0);
            }}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        Showing page <strong>{totalPages > 0 ? page + 1 : 0}</strong> of <strong>{totalPages}</strong>, total <strong>{total}</strong> applicant{total === 1 ? "" : "s"}
      </div>
    </div>
  );

  const renderApplicantsTable = () => (
    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
      {applicantsLoading ? (
        <div className="p-12 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-black"></div>
          <p className="mt-4 text-sm text-gray-500">Loading applicants…</p>
        </div>
      ) : applicantsError ? (
        <div className="rounded-none border-0 px-4 py-3 text-sm text-red-700 bg-red-50">
          {applicantsError}
        </div>
      ) : applicants.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500">No applicants found.</div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#fdf8ea]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Job Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Applied At</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Resume</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-[#8a7643]">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {applicants.map((app, index) => {
                  const name = app.name || app.fullName || `${app.firstName || ""} ${app.lastName || ""}`.trim() || "—";
                  const email = app.email || app.contactEmail || "—";
                  const phone = app.phone || app.mobile || app.contactNumber || "—";
                  const jobTitle = app.jobTitle || app.position || "—";
                  const appliedAtRaw = app.appliedAt || app.createdAt || app.submittedAt;
                  const appliedAt = appliedAtRaw ? new Date(appliedAtRaw).toLocaleString() : "—";
                  const resume = app.resumeUrl || app.resume || app.cvUrl || "";
                  const currentStatus = app.status || app.applicationStatus || "New";
                  const normalizedId = String(app?.id ?? app?._id?.$oid ?? app?._id ?? app?.applicantId ?? "");
                  return (
                    <tr key={`${email}-${index}`} className="hover:bg-[#fbf6e6]">
                      <td className="px-6 py-5 text-sm text-black">{name}</td>
                      <td className="px-6 py-5 text-sm text-[#473d21]">{email}</td>
                      <td className="px-6 py-5 text-sm text-[#473d21]">{phone}</td>
                      <td className="px-6 py-5 text-sm text-[#473d21]">{jobTitle}</td>
                      <td className="px-6 py-5 text-sm text-[#473d21]">{appliedAt}</td>
                      <td className="px-6 py-5 text-sm">
                        {resume ? (
                          <a href={resume} target="_blank" rel="noreferrer" className="text-[#8a7643] hover:text-black underline">
                            View
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <span className="inline-flex rounded-full bg-[#f7f1de] px-3 py-1 text-xs font-medium text-[#58471c]">
                          {currentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <select
                            defaultValue={currentStatus}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              if (!normalizedId) return;
                              setUpdatingApplicantId(normalizedId);
                              updateApplicantStatus(normalizedId, { status: newStatus })
                                .then(() => {
                                  setApplicants((prev) =>
                                    prev.map((it) => {
                                      const itId = String(it?.id ?? it?._id?.$oid ?? it?._id ?? it?.applicantId ?? "");
                                      if (itId === normalizedId) {
                                        return { ...it, status: newStatus, applicationStatus: newStatus };
                                      }
                                      return it;
                                    })
                                  );
                                })
                                .catch((err) => {
                                  alert(err?.response?.data?.message || err.message || "Failed to update status");
                                })
                                .finally(() => setUpdatingApplicantId(null));
                            }}
                            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                            disabled={!normalizedId || updatingApplicantId === normalizedId}
                          >
                            {[...new Set([currentStatus, ...APPLICANT_STATUS_OPTIONS])].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          {updatingApplicantId === normalizedId && (
                            <div className="h-4 w-4 animate-spin rounded-full border border-[#a7866a] border-t-transparent" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="md:hidden divide-y divide-gray-200">
            {applicants.map((app, index) => {
              const name = app.name || app.fullName || `${app.firstName || ""} ${app.lastName || ""}`.trim() || "—";
              const email = app.email || app.contactEmail || "—";
              const phone = app.phone || app.mobile || app.contactNumber || "—";
              const jobTitle = app.jobTitle || app.position || "—";
              const appliedAtRaw = app.appliedAt || app.createdAt || app.submittedAt;
              const appliedAt = appliedAtRaw ? new Date(appliedAtRaw).toLocaleString() : "—";
              const resume = app.resumeUrl || app.resume || app.cvUrl || "";
              const currentStatus = app.status || app.applicationStatus || "New";
              const normalizedId = String(app?.id ?? app?._id?.$oid ?? app?._id ?? app?.applicantId ?? "");
              return (
                <div key={`${email}-${index}`} className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-medium text-black flex items-center gap-2">
                        <Users size={16} /> {name}
                      </h3>
                      <p className="text-xs text-gray-500">{jobTitle}</p>
                    </div>
                  </div>
                  <div className="text-sm text-[#473d21] space-y-1">
                    <p>Email: {email}</p>
                    <p>Phone: {phone}</p>
                    <p>Applied: {appliedAt}</p>
                    <p>
                      Resume:{" "}
                      {resume ? (
                        <a href={resume} target="_blank" rel="noreferrer" className="text-[#8a7643] underline">
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="inline-flex rounded-full bg-[#f7f1de] px-2 py-0.5 text-xs font-medium text-[#58471c]">
                        {currentStatus}
                      </span>
                      <select
                        defaultValue={currentStatus}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          if (!normalizedId) return;
                          setUpdatingApplicantId(normalizedId);
                          updateApplicantStatus(normalizedId, { status: newStatus })
                            .then(() => {
                              setApplicants((prev) =>
                                prev.map((it) => {
                                  const itId = String(it?.id ?? it?._id?.$oid ?? it?._id ?? it?.applicantId ?? "");
                                  if (itId === normalizedId) {
                                    return { ...it, status: newStatus, applicationStatus: newStatus };
                                  }
                                  return it;
                                })
                              );
                            })
                            .catch((err) => {
                              alert(err?.response?.data?.message || err.message || "Failed to update status");
                            })
                            .finally(() => setUpdatingApplicantId(null));
                        }}
                        className="rounded-full border border-gray-200 px-3 py-1 text-xs focus:outline-none focus:border-black"
                        disabled={!normalizedId || updatingApplicantId === normalizedId}
                      >
                        {[...new Set([currentStatus, ...APPLICANT_STATUS_OPTIONS])].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {updatingApplicantId === normalizedId && (
                        <div className="h-4 w-4 animate-spin rounded-full border border-[#a7866a] border-t-transparent" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            <div className="text-sm text-gray-600">
              Page <strong>{totalPages > 0 ? page + 1 : 0}</strong> of <strong>{totalPages}</strong>
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => (totalPages === 0 || p + 1 >= totalPages ? p : p + 1))}
              disabled={totalPages === 0 || page + 1 >= totalPages}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderEmpty = () => (
    <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5eed6] text-[#7a6b3f]">
        <Briefcase size={26} />
      </div>
      <h3 className="text-xl font-light text-black">No jobs found</h3>
      <p className="text-sm text-gray-500">Try changing the status filter or create a new listing.</p>
      <button
        type="button"
        onClick={() => navigate("/career/create")}
        className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm text-white hover:bg-gray-900"
      >
        <Plus size={16} /> Create job
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderHeader()}
      {renderTabs()}
      {activeTab === "Jobs" ? renderFilters() : renderApplicantsFilters()}

      {activeTab === "Jobs" && error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {activeTab === "Jobs" ? (
        loading ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-black"></div>
            <p className="mt-4 text-sm text-gray-500">Loading jobs…</p>
          </div>
        ) : jobs.length === 0 ? (
          renderEmpty()
        ) : (
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#fdf8ea]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Job</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Experience</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-[#8a7643]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {jobs.map((job, index) => {
                    const rawId = job?.id ?? job?._id?.$oid ?? job?._id ?? job?.jobId;
                    const identifier = rawId ? String(rawId) : `job-${index}`;
                    return (
                      <tr key={`${identifier}-${index}`} className="hover:bg-[#fbf6e6]">
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-black">{job.jobTitle || "Untitled role"}</div>
                            <div className="text-xs text-gray-500">ID: {job.jobId || "—"}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-[#473d21]">{job.department || "—"}</td>
                        <td className="px-6 py-5 text-sm text-[#473d21]">
                          {job.location?.city && (
                            <span>
                              {job.location.city}
                              {job.location.state ? ", " + job.location.state : ""}
                              {job.location.country ? ", " + job.location.country : ""}
                            </span>
                          )}
                          {!job.location?.city && job.location?.country && job.location.country}
                          {job.location?.remote && (
                            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#ecf8f1] px-2 py-0.5 text-xs text-[#1a5932]">
                              Remote
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-sm text-[#473d21]">
                          {job.experienceRequired?.min ?? "—"} – {job.experienceRequired?.max ?? "—"} {job.experienceRequired?.unit}
                        </td>
                        <td className="px-6 py-5 text-sm">
                          <span className="inline-flex rounded-full bg-[#f7f1de] px-3 py-1 text-xs font-medium text-[#58471c]">
                            {job.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(job)}
                              className="text-[#8a7643] hover:text-black"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(job)}
                              disabled={deleteLoading === identifier}
                              className="text-[#a7866a] hover:text-red-600 disabled:opacity-40"
                            >
                              {deleteLoading === identifier ? (
                                <div className="h-4 w-4 animate-spin rounded-full border border-[#a7866a] border-t-transparent" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-200">
              {jobs.map((job, index) => {
                const rawId = job?.id ?? job?._id?.$oid ?? job?._id ?? job?.jobId;
                const identifier = rawId ? String(rawId) : `job-${index}`;
                return (
                  <div key={`${identifier}-${index}`} className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium text-black">{job.jobTitle || "Untitled role"}</h3>
                        <p className="text-xs text-gray-500">{job.department || ""}</p>
                      </div>
                      <span className="inline-flex rounded-full bg-[#f7f1de] px-3 py-1 text-xs font-medium text-[#58471c]">
                        {job.status || "Unknown"}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-[#473d21]">
                      <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#b09d6a]">
                        <MapPin size={14} />
                        <span className="normal-case text-[#473d21]">
                          {job.location?.city
                            ? `${job.location.city}${job.location.state ? ", " + job.location.state : ""}${job.location.country ? ", " + job.location.country : ""}`
                            : job.location?.country || "Location TBA"}
                          {job.location?.remote ? " · Remote" : ""}
                        </span>
                      </p>
                      <p>
                        Experience: {job.experienceRequired?.min ?? "—"} – {job.experienceRequired?.max ?? "—"} {job.experienceRequired?.unit || "years"}
                      </p>
                    </div>
                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => handleEdit(job)}
                        className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-4 py-1.5 text-sm text-[#8a7643] hover:border-[#8a7643] hover:text-black"
                      >
                        <Edit2 size={15} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(job)}
                        disabled={deleteLoading === identifier}
                        className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-4 py-1.5 text-sm text-[#a7866a] hover:border-red-500 hover:text-red-600 disabled:opacity-40"
                      >
                        {deleteLoading === identifier ? (
                          <div className="h-4 w-4 animate-spin rounded-full border border-[#a7866a] border-t-transparent" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        renderApplicantsTable()
      )}
    </div>
  );
};

export default CareerJobsPage;


