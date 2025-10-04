import { useSearchParams } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";

export default function Login() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') as "login" | "register" || "login";

  return <AuthLayout initialMode={mode} />;
}