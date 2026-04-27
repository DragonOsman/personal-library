import AuthHandlerClient from "../AuthHandlerClient";

export default function Page({
  params,
  searchParams
}: {
  params: { type: string };
  searchParams: { redirect?: string };
}) {
  return (
    <AuthHandlerClient
      type={params.type}
      redirect={searchParams.redirect}
    />
  );
}