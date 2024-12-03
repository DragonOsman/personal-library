import { Suspense } from "react";
import Form from "./form";

const Send = () => {
  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <p className="text-red-600">Please verify your email address first</p>
      </div>
      <Suspense>
        <Form />
      </Suspense>
    </div>
  );
};

export default Send;