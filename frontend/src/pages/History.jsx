import { useState, useEffect } from 'react';
import API from '../api/axios';
import ReviewResult from '../components/ReviewResult';

export default function History() {
  const [reviews, setReviews]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('feedback'); // 'feedback' | 'resume' | 'job'
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    API.get('/review')
      .then(({ data }) => setReviews(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await API.delete(`/review/${id}`);
    setReviews(reviews.filter(r => r._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  // When user clicks a review card, open it and reset tab to feedback
  const handleSelect = (review) => {
    if (selected?._id === review._id) {
      setSelected(null);  // clicking same one closes it
    } else {
      setSelected(review);
      setActiveTab('feedback');  // always start on feedback tab
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-white/40">
      Loading history...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Review History</h1>
      <p className="text-white/40 text-sm mb-8">Click any review to see full details</p>

      {reviews.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-4xl mb-3">📄</p>
          <p>No reviews yet. Go analyze your resume!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review._id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">

              {/* ── Summary row (always visible) ── */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/5 transition"
                onClick={() => handleSelect(review)}
              >
                <div className="flex items-center gap-4">
                  {/* Score badge */}
                  <div className={`text-xl font-bold w-12 text-center ${
                    review.feedback.matchScore >= 75 ? 'text-emerald-400' :
                    review.feedback.matchScore >= 50 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {review.feedback.matchScore}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{review.jobTitle}</p>
                    <p className="text-xs text-white/30">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(review._id); }}
                    className="text-xs text-red-400/60 hover:text-red-400 transition px-2 py-1 rounded-lg hover:bg-red-400/10"
                  >
                    Delete
                  </button>
                  <span className="text-white/30 text-xs">
                    {selected?._id === review._id ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* ── Expanded section ── */}
              {selected?._id === review._id && (
                <div className="border-t border-white/10">

                  {/* Tab bar — 3 tabs */}
                  <div className="flex border-b border-white/10">
                    {[
                      { key: 'feedback', label: '🤖 AI Feedback' },
                      { key: 'resume',   label: '📄 Resume'      },
                      { key: 'job',      label: '💼 Job Description' },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-3 text-xs font-medium transition border-b-2 ${
                          activeTab === tab.key
                            ? 'border-violet-500 text-violet-400'
                            : 'border-transparent text-white/40 hover:text-white/70'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div className="p-5">

                    {/* Feedback tab */}
                    {activeTab === 'feedback' && (
                      <ReviewResult review={review} />
                    )}

                    {/* Resume tab */}
                    {activeTab === 'resume' && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs text-white/40 uppercase tracking-wider">
                            Resume submitted for this review
                          </h3>
                          {/* Copy button */}
                          <button
                            onClick={() => navigator.clipboard.writeText(review.resumeText)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition"
                          >
                            Copy
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap text-sm text-white/70 bg-white/5 border border-white/10 rounded-xl p-5 leading-relaxed max-h-96 overflow-y-auto">
                          {review.resumeText}
                        </pre>
                      </div>
                    )}

                    {/* Job Description tab */}
                    {activeTab === 'job' && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs text-white/40 uppercase tracking-wider">
                            Job description used for this review
                          </h3>
                          <button
                            onClick={() => navigator.clipboard.writeText(review.jobDescription)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition"
                          >
                            Copy
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap text-sm text-white/70 bg-white/5 border border-white/10 rounded-xl p-5 leading-relaxed max-h-96 overflow-y-auto">
                          {review.jobDescription}
                        </pre>
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}