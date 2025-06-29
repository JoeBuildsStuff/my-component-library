import { OpenInV0Button } from "@/components/button-open-in-v0";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="w-fit mx-auto my-10">
        <OpenInV0Button url="https://v0.dev/chat/api/open?title=JT+Builds+Stuff+-+Mode+Toggle&prompt=This+is+a+mode+toggle&url=https%3A%2F%2Fmy-component-library-woad.vercel.app%2Fr%2Fmode-toggle.json" />
      </div>
    </main>
  );
}