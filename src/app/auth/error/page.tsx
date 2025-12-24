import { Suspense } from "react";
import AuthErrorContent from "./content";

const AuthErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <Suspense fallback={<div>Loading error details...</div>}>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
};

export default AuthErrorPage;