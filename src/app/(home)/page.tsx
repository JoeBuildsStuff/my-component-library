import { OpenInV0Button } from "@/components/button-open-in-v0";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="w-fit mx-auto my-10">
        <OpenInV0Button url="https://my-component-library-woad.vercel.app/r/mode-togle.json" />
      </div>
    </main>
  );
}
