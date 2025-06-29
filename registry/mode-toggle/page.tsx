import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Your App
          </h1>
          <p className="text-xl text-muted-foreground">
            This is a sample page demonstrating the mode toggle component.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-muted-foreground">
            Toggle theme:
          </span>
          <ModeToggle />
        </div>
        
        <div className="space-y-4 text-left">
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Light, dark, and system theme modes</li>
            <li>• Smooth transitions between themes</li>
            <li>• Persisted theme preference</li>
            <li>• Accessible dropdown menu</li>
          </ul>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-medium mb-2">Card Example</h3>
          <p className="text-sm text-muted-foreground">
            This card demonstrates how the theme colors work across different components.
            Try switching between light and dark modes to see the changes.
          </p>
        </div>
      </div>
    </div>
  );
} 