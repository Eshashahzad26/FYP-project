import React, { useState, useEffect } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Heart, 
  ThumbsDown, 
  MessageSquare, 
  Lock, 
  Power,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { apiClient } from '../../../backend/apiClient.ts';
import { SharedTryOn, FamilyOpinion } from '../../../database/types.ts';

export const ShareWithFamilyModal: React.FC = () => {
  const { activeShareId, setActiveShareId, showToast } = useApp();

  const [sharedData, setSharedData] = useState<SharedTryOn | null>(null);
  const [copied, setCopied] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newRelationship, setNewRelationship] = useState<'Mother' | 'Sister' | 'Friend' | 'Cousin' | 'Aunt' | 'Family'>('Sister');
  const [newVote, setNewVote] = useState<'love' | 'neutral' | 'dislike'>('love');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeShareId) {
      apiClient.getSharedTryOn(activeShareId)
        .then(setSharedData)
        .catch(err => {
          console.warn(err);
          setActiveShareId(null);
        });
    }
  }, [activeShareId]);

  if (!activeShareId || !sharedData) return null;

  const shareableUrl = `${window.location.origin}/?share=${activeShareId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    showToast('Private share link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleActive = async () => {
    const nextState = await apiClient.toggleShareLink(activeShareId);
    setSharedData({ ...sharedData, isActive: nextState });
    showToast(nextState ? 'Share link is now active.' : 'Share link disabled for privacy.');
  };

  const handleAddOpinion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthorName.trim() || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const op = await apiClient.submitFamilyOpinion(activeShareId, {
        authorName: newAuthorName,
        relationship: newRelationship,
        vote: newVote,
        comment: newComment
      });

      setSharedData({
        ...sharedData,
        opinions: [...sharedData.opinions, op]
      });

      setNewAuthorName('');
      setNewComment('');
      setIsSubmitting(false);
      showToast('Opinion posted successfully!');
    } catch (err: any) {
      setIsSubmitting(false);
      showToast('Error submitting opinion: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#eed4e0] shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveShareId(null)}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#eed4e0] pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#903458] font-bold uppercase tracking-wider mb-0.5">
                <Users className="w-4 h-4" />
                <span>Family Opinion Circle (FE-8)</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Share Outfit with Family & Friends
              </h2>
            </div>

            {/* Toggle Link Active / Inactive (FR-8.5) */}
            <button
              onClick={handleToggleActive}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                sharedData.isActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-stone-100 text-stone-500 border-stone-300'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{sharedData.isActive ? 'Link Active' : 'Link Turned Off'}</span>
            </button>
          </div>

          {/* Privacy Note (FR-8.2, NFR-13) */}
          <div className="p-3 rounded-xl bg-[#fdf5f8] border border-[#eed4e0] text-[11px] text-stone-600 flex items-start gap-2">
            <Lock className="w-4 h-4 text-[#903458] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Privacy Protection (FR-8.2):</strong> This private link shows ONLY the outfit try-on result and garment details. Your private measurements, full gallery, and personal account data are strictly hidden.
            </p>
          </div>

          {/* Shared Link Copy Box (FR-8.1) */}
          <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200">
            <input
              type="text"
              readOnly
              value={sharedData.isActive ? shareableUrl : 'Link is currently turned off by user.'}
              className="flex-1 text-xs bg-transparent text-stone-700 px-2 select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              disabled={!sharedData.isActive}
              className="px-3.5 py-1.5 rounded-lg bg-[#903458] hover:bg-[#782847] disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Shared Try-On Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#fcf8fa] p-4 rounded-2xl border border-[#eed4e0]">
            <img
              src={sharedData.tryOnResultUrl}
              alt="Shared Try-On Result"
              className="w-full h-52 object-cover rounded-xl border border-stone-200"
            />
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#903458] uppercase">{sharedData.brand}</span>
              <h3 className="font-serif font-bold text-base text-stone-900">{sharedData.productName}</h3>
              <p className="text-sm font-bold text-stone-800">PKR {sharedData.price.toLocaleString()}</p>
              <div className="pt-2 text-[11px] text-stone-500">
                <span>Opinions Received: <strong>{sharedData.opinions.length}</strong></span>
              </div>
            </div>
          </div>

          {/* Received Family Opinions List (FR-8.4) */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-900">
              Family Feedback & Votes ({sharedData.opinions.length}):
            </h4>

            {sharedData.opinions.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-2">
                No opinions received yet. Share the link above with your mother, sister, or friends!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {sharedData.opinions.map((op) => (
                  <div key={op.id} className="p-3 rounded-xl bg-white border border-[#eed4e0] shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-stone-900">{op.authorName}</strong>
                        <span className="text-[10px] text-stone-400">({op.relationship})</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        op.vote === 'love' ? 'bg-red-50 text-red-600' : op.vote === 'neutral' ? 'bg-stone-100 text-stone-600' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {op.vote === 'love' ? '❤️ Loved it!' : op.vote === 'neutral' ? '😐 Neutral' : '👎 Not for you'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      "{op.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Simulated Quick Opinion submission form (FR-8.3) */}
          {sharedData.isActive && (
            <form onSubmit={handleAddOpinion} className="pt-4 border-t border-[#eed4e0] space-y-3">
              <h4 className="font-serif font-bold text-xs text-stone-900">
                Add an Opinion (Simulation):
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Your Name (e.g. Khala, Ayesha)"
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  className="text-xs p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                />

                <select
                  value={newRelationship}
                  onChange={(e) => setNewRelationship(e.target.value as any)}
                  className="text-xs p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                >
                  <option value="Mother">Mother / Ami</option>
                  <option value="Sister">Sister / Baji</option>
                  <option value="Friend">Friend</option>
                  <option value="Cousin">Cousin</option>
                  <option value="Aunt">Aunt / Khala</option>
                  <option value="Family">Family Member</option>
                </select>

                <select
                  value={newVote}
                  onChange={(e) => setNewVote(e.target.value as any)}
                  className="text-xs p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                >
                  <option value="love">❤️ Love it!</option>
                  <option value="neutral">😐 Neutral</option>
                  <option value="dislike">👎 Not for you</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Write a sweet comment on color, fit, or styling..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 text-xs p-2.5 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-bold"
                >
                  Post
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
