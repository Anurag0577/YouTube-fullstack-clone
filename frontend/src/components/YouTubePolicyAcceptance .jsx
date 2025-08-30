import React, { useState } from 'react';

const YouTubePolicyAcceptance = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white font-sans">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black mb-2">YouTube Video Upload Policy</h2>
        <p className="text-sm text-black mb-4">
          Please review and understand these important guidelines before uploading your video:
        </p>
      </div>

      {/* Policy Content */}
      <div className="space-y-6 mb-8">
        {/* Community Guidelines */}
        <div>
          <h3 className="font-semibold text-black mb-2">Community Guidelines</h3>
          <p className="text-sm text-black leading-relaxed">
            Your content must comply with YouTube's Community Guidelines. This includes avoiding harmful or dangerous content, 
            hate speech, harassment, violent or graphic content, and spam or misleading metadata.
          </p>
        </div>

        {/* Copyright */}
        <div>
          <h3 className="font-semibold text-black mb-2">Copyright & Intellectual Property</h3>
          <p className="text-sm text-black leading-relaxed">
            You must own all rights to your content or have permission from the rights holders. 
            Do not upload copyrighted music, videos, or other materials without proper authorization.
          </p>
        </div>

        {/* Age-Appropriate Content */}
        <div>
          <h3 className="font-semibold text-black mb-2">Child Safety</h3>
          <p className="text-sm text-black leading-relaxed">
            Content featuring minors must comply with child safety policies. 
            Ensure content is appropriate and follows guidelines for content involving children.
          </p>
        </div>

        {/* Monetization */}
        <div>
          <h3 className="font-semibold text-black mb-2">Monetization Policies</h3>
          <p className="text-sm text-black leading-relaxed">
            If you plan to monetize your content, it must meet YouTube's monetization policies 
            and advertiser-friendly content guidelines.
          </p>
        </div>

        {/* Consequences */}
        <div>
          <h3 className="font-semibold text-black mb-2">Policy Violations</h3>
          <p className="text-sm text-black leading-relaxed">
            Videos that violate YouTube's policies may be removed, age-restricted, or demonetized. 
            Repeated violations can result in strikes against your channel or account termination.
          </p>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mb-8">
        <h4 className="font-semibold text-black mb-2">Learn More</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="#" className="text-black underline hover:no-underline">Community Guidelines</a>
          <a href="#" className="text-black underline hover:no-underline">Copyright Basics</a>
          <a href="#" className="text-black underline hover:no-underline">Creator Academy</a>
          <a href="#" className="text-black underline hover:no-underline">Terms of Service</a>
        </div>
      </div>

      {/* Checkbox Agreement */}
      <div className="border-t border-gray-200 pt-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mt-1 h-5 w-5"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-black">
              I have read, understood, and agree to comply with YouTube's video upload policies and community guidelines.
            </span>
            <p className="text-xs text-gray-500 mt-1">
              By checking this box, you confirm that your video content adheres to all applicable YouTube policies.
            </p>
          </div>
        </label>

        {/* Status Indicator */}
        {isChecked && (
          <div className="mt-4 p-3 border border-gray-200 rounded">
            <span className="text-sm text-black font-medium">
              Policy agreement confirmed. You may proceed with your video upload.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubePolicyAcceptance;
