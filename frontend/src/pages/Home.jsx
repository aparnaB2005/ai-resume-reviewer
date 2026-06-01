import { useState } from 'react';
import API from '../api/axios';
import ReviewResult from '../components/ReviewResult';

export default function Home() {
  const [form, setForm] = useState({ jobTitle: '', jobDescription: '', resumeText: '' });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const { data } = await API.post('/review', form);
      setResult(data);    // data = the saved review document from MongoDB
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Powered by Groq AI
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
          AI Resume Reviewer
        </h1>
        <p className="text-white/50 max-w-md mx-auto text-sm">
          Paste your resume and job description. Get an ATS score, strengths, gaps, and rewrite suggestions instantly.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6">
        {/* Job Title */}
        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Job Title</label>
          <input
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            required
            placeholder="e.g. Frontend Developer at Google"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 transition placeholder-white/20"
          />
        </div>

        {/* Two textareas side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Your Resume</label>
            <textarea
              name="resumeText"
              value={form.resumeText}
              onChange={handleChange}
              required
              rows={10}
              placeholder="Paste your full resume here..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 transition placeholder-white/20 resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Job Description</label>
            <textarea
              name="jobDescription"
              value={form.jobDescription}
              onChange={handleChange}
              required
              rows={10}
              placeholder="Paste the job description here..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 transition placeholder-white/20 resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70"/>
              </svg>
              Analyzing with AI...
            </>
          ) : '✨ Analyze My Resume'}
        </button>
      </form>

      {/* AI Result appears below */}
      {result && <ReviewResult review={result} />}
    </div>
  );
}