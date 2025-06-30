import { LucideIcon } from "lucide-react";

interface LogoProps {
  icon: LucideIcon;
  text: string;
}

export default function Logo({ icon: Icon, text }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-foreground text-background dark:bg-secondary dark:text-foreground rounded-lg">
        <Icon className="size-5" />
      </div>
      <span className="hidden sm:block">{text}</span>
    </div>
  )
}