import { Bird } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <Bird className="size-10 shrink-0" />
        <h1 className="text-2xl font-bold">App Name</h1>
        <p className="text-sm text-muted-foreground">
          This is an app description.
        </p>
      {children}
    </main>
  );
}
