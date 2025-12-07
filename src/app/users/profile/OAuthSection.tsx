import { signIn } from "@/src/auth";

const OAuthSection = () => {
  const googleSignInBtn = (
    <button
      type="button"
      title="Sign in with Google"
      onClick={() => signIn("google")}
      className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Sign in with Google
    </button>
  );
  const githubSignInBtn = (
    <button
      type="button"
      title="Sign in with GitHub"
      onClick={() => signIn("github")}
      className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Sign in with GitHub
    </button>
  );

  return (
    <div className="oauthSection flex flex-col gap-4">
      {googleSignInBtn}
      {githubSignInBtn}
    </div>
  );
};

export default OAuthSection;