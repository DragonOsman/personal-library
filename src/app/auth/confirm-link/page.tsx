import { Suspense } from "react";
import ConfirmLinkClient from "./ConfirmLinkClient";

const ConfirmLinkPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Suspense fallback={<div className="animate-spin h-8 w-8 border-b-2 border-brand-primary rounded-full" />}>
        <ConfirmLinkClient />
      </Suspense>
    </div>
  );
};

export default ConfirmLinkPage;