import { OpenInV0Button } from "@/components/button-open-in-v0";
import { Card, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="w-fit mx-auto my-10 space-y-2">
        <div className="flex flex-row gap-2 justify-end">
         <OpenInV0Button 
           url="https://my-component-library-woad.vercel.app/r/button-open-in-v0.json"
           title="JT Builds Stuff - Open in v0"
           prompt="This is a button to open a component in v0"
         />
        </div>
        <Card className="h-[450px] w-[500px] justify-center items-center bg-background">
          <CardContent>
            <OpenInV0Button 
              url="https://my-component-library-woad.vercel.app/r/button-open-in-v0.json"
              title="JT Builds Stuff - Open in v0"
              prompt="This is a button to open a component in v0"
            />
          </CardContent>
        </Card>
      </div>

      <div className="w-fit mx-auto my-10 space-y-2">
        <div className="flex flex-row gap-2 justify-end">
         <OpenInV0Button 
           url="https://my-component-library-woad.vercel.app/r/mode-toggle.json"
           title="JT Builds Stuff - Mode Toggle"
           prompt="This is a mode toggle"
         />
        </div>
        <Card className="h-[450px] w-[500px] justify-center items-center bg-background">
          <CardContent>
<ModeToggle />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}