import VerifyEmail from "./verify-email";
import { Suspense } from "react";

const Verify = () => {
  return (
    <Suspense>
      <div className="flex flex-col">
        <VerifyEmail />
      </div>
    </Suspense>
  );
};

export default Verify;