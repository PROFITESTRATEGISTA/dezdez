import React from 'react';
import { X, Star } from 'lucide-react';

interface SurveyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SurveyPopup: React.FC<SurveyPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Customer Feedback Survey</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Survey Content */}
        <div className="p-6 space-y-6">
          {/* Multiple Choice Question */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">How did you hear about our service?</h3>
            <div className="space-y-2">
              {['Social Media', 'Friend/Family', 'Search Engine', 'Advertisement', 'Other'].map((option) => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="hear-about" 
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Question */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">How would you rate your overall experience?</h3>
            <div className="flex space-x-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label key={rating} className="flex flex-col items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating" 
                    value={rating} 
                    className="sr-only"
                  />
                  <Star 
                    className="h-8 w-8 text-gray-300 hover:text-yellow-400 transition-colors" 
                  />
                  <span className="text-sm text-gray-600 mt-1">{rating}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Text Input Question */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Do you have any additional comments or suggestions?</h3>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your feedback helps us improve..."
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyPopup;