"use client";

export default function DefaultSection() {
  return (
    <div className="space-y-6">
      <p>
        Choose the default values used whenever you add a new book.
      </p>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Default Reading Status</span>
        </label>

        <select className="select select-bordered max-w-xs">
          <option>Want to Read</option>
          <option>Reading</option>
          <option>Completed</option>
          <option>On Hold</option>
          <option>Dropped</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Default Language</span>
        </label>

        <input
          type="text"
          className="input input-bordered max-w-xs"
          placeholder="English"
        />
      </div>

      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          className="checkbox"
          defaultChecked
        />
        <span className="label-text">
          Automatically fetch Google Books metadata
        </span>
      </label>

      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          className="checkbox"
          defaultChecked
        />
        <span className="label-text">
          Automatically use the first cover image
        </span>
      </label>
    </div>
  );
}