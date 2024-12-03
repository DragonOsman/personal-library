import { useFormStatus } from "react-dom";
import { Button } from "@mui/material";

const ResendButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      title="resend verification email"
      className="rounded disabled:bg-slate-50 disabled:text-slate-500"
      variant="outlined"
      disabled={pending ? true : false}
    >
      Send verification link{pending ? "..." : ""}
    </Button>
  );
};

export default ResendButton;