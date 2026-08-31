"use client";

export default function DisplaySection() {
  return (
    <div className="space-y-6">
      <p>
        Configure how your library is displayed and organized.
      </p>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Default View</span>
        </label>

        <select className="select select-bordered max-w-xs">
          <option>Grid</option>
          <option>List</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Books per page</span>
        </label>

        <select className="select select-bordered max-w-xs">
          <option>10</option>
          <option>20</option>
          <option>50</option>
          <option>100</option>
        </select>
      </div>

      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          className="checkbox"
          defaultChecked
        />
        <span className="label-text">Show book covers</span>
      </label>

      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          className="checkbox"
          defaultChecked
        />
        <span className="label-text">Show ratings</span>
      </label>

      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          className="checkbox"
          defaultChecked
        />
        <span className="label-text">Show descriptions</span>
      </label>
    </div>
  );
}