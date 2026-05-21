import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { LoginForm } from "@/components/admin/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth-options";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  if (session?.user?.role === "ADMIN") {
    redirect(params.callbackUrl ?? "/admin/payments");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>관리자 로그인</CardTitle>
          <CardDescription>NextAuth Credentials 기반 관리자 Role 접근 제어</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm callbackUrl={params.callbackUrl ?? "/admin/payments"} />
        </CardContent>
      </Card>
    </main>
  );
}
