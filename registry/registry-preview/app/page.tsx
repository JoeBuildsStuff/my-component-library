import RegistryPreview from "../components/registry-preview";
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <div>
            <RegistryPreview>
                <Button>Preview</Button>
            </RegistryPreview>
        </div>
    );
}