"use client";

export default function PrivacySection() {
  return (
    <div className="space-y-6">
      <p>
        Manage how your library and profile information are shared.
      </p>

      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          className="checkbox"
          defaultChecked
        />
        <span className="label-text">
          Keep my library private
        </span>
      </label>

      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          className="checkbox"
        />
        <span className="label-text">
          Allow others to discover my profile
        </span>
      </label>

      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          className="checkbox"
        />
        <span className="label-text">
          Share my reading activity
        </span>
      </label>

      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          className="checkbox"
        />
        <span className="label-text">
          Share my ratings and reviews
        </span>
      </label>
    </div>
  );
}