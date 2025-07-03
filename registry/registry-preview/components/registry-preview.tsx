
import { Card } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export interface RegistryPreviewProps {
  /**
   * The component(s) to preview inside the resizable container
   */
  children: React.ReactNode;
  /**
   * The default size of the main panel as a percentage (0-100)
   * @default 98
   */
  defaultSize?: number;
  /**
   * The minimum size of the main panel as a percentage (0-100)
   * @default 5
   */
  minSize?: number;
  /**
   * The maximum size of the main panel as a percentage (0-100)
   * @default 98
   */
  maxSize?: number;
  /**
   * The minimum height of the preview container
   * @default "350px"
   */
  minHeight?: string;
  /**
   * The maximum width of the preview container
   * @default "4xl"
   */
  maxWidth?: string;
  /**
   * Custom CSS class name for the container
   */
  className?: string;
  /**
   * Whether to show the dotted grid background
   * @default true
   */
  showGrid?: boolean;
}

export default function RegistryPreview({ 
  children, 
  defaultSize = 98, 
  minSize = 5, 
  maxSize = 98,
  minHeight = "350px",
  maxWidth = "4xl",
  className = "",
  showGrid = true
}: RegistryPreviewProps) {
  return (
    <div className={`relative ${showGrid ? 'before:absolute before:inset-0 before:bg-[radial-gradient(#ccc_1px,transparent_1px)] before:bg-[length:10px_10px] before:opacity-40 dark:before:opacity-10 before:z-0' : ''} overflow-hidden ${className}`}>
      <ResizablePanelGroup
        direction="horizontal"
        className={`relative z-10 mx-auto rounded-lg border max-w-${maxWidth}`}
        style={{ minHeight }}
      >
        <ResizablePanel defaultSize={defaultSize} minSize={minSize} maxSize={maxSize}>
        <Card className="h-full w-full items-center justify-center shadow-none p-6 bg-background border-0 rounded-none">
            {children}
          </Card>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="h-full bg-transparent" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}