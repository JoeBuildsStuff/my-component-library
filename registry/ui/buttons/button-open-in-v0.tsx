import { Button } from "@/components/ui/button"
import Link from "next/link"

export interface OpenInV0ButtonProps {
  /** The URL to the component JSON file that will be opened in v0 */
  url: string;
  /** Optional title that will be passed to v0 for context */
  title?: string;
  /** Optional prompt that will be passed to v0 for additional context */
  prompt?: string;
  /** 
   * The visual style variant of the button
   * @default "outline"
   */
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /** 
   * The size of the button
   * @default "sm"
   */
  buttonSize?: "default" | "sm" | "lg" | "icon";
}

export function OpenInV0Button({ url, title, prompt, buttonVariant = "outline", buttonSize = "sm" }: OpenInV0ButtonProps) {
  const buildV0Url = () => {
    const params = new URLSearchParams();
    params.append('url', url);
    
    if (title) {
      params.append('title', title);
    }
    
    if (prompt) {
      params.append('prompt', prompt);
    }
    
    return `https://v0.dev/chat/api/open?${params.toString()}`;
  };

  return (
    <Button
      aria-label="Open in v0"
      className=""
      asChild
      variant={buttonVariant}
      size={buttonSize}
    >
      <Link
        href={buildV0Url()}
        target="_blank"
        rel="noreferrer"
        className="no-underline text-sm font-normal"
      >
        {buttonSize === "icon" ? null : "Open in"}
        <svg
          viewBox="0 0 40 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-6 text-current"
        >
          <path
            d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"
            fill="currentColor"
          ></path>
          <path
            d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"
            fill="currentColor"
          ></path>
        </svg>
      </Link>
    </Button>
  )
}