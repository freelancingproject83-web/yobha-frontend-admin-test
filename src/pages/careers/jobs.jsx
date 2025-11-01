import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Edit2, Trash2, RefreshCw, Plus, MapPin } from "lucide-react";
import { deleteCareerJob, getCareerJobs } from "../../service/career";

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
      {renderFilters()}

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
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
      )}
    </div>
  );
};

export default CareerJobsPage;


