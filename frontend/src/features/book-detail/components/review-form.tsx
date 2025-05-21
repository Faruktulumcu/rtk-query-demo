import { useEffect, useState } from 'react';
import type { Review } from '@/common/types';
import { Globe, Lock, Send } from 'lucide-react';

type ReviewFormProps = {
  onSubmit: (content: string, isPublic: boolean) => Promise<void>;
  editingReview: Review | null;
  onCancel: () => void;
};

export const ReviewForm = ({ onSubmit, editingReview, onCancel }: ReviewFormProps) => {
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (editingReview) {
      setContent(editingReview.content);
      setIsPublic(editingReview.public);
    } else {
      setContent('');
      setIsPublic(true);
    }
  }, [editingReview]);

  const handleSubmit = async () => {
    await onSubmit(content, isPublic);
    setContent('');
    setIsPublic(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium mb-4 text-gray-800">{editingReview ? 'Edit Review' : 'Write a Review'}</h2>
      <textarea
        className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        rows={4}
        placeholder="Share your thoughts about this book..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex items-center justify-between mt-4">
        {/* Modern Toggle Switch */}
        <label className="inline-flex items-center cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={Boolean(isPublic)}
              onChange={() => setIsPublic((prev) => !prev)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </div>
          <div className="ml-3 flex items-center gap-1.5">
            {isPublic ? (
              <>
                <Globe size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Public review</span>
              </>
            ) : (
              <>
                <Lock size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Private review</span>
              </>
            )}
          </div>
        </label>

        <div className="flex gap-2">
          {editingReview && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            disabled={!content.trim()}>
            <Send size={16} />
            {editingReview ? 'Update' : 'Post'} Review
          </button>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500 text-right">{content.length} characters</div>
    </div>
  );
};
