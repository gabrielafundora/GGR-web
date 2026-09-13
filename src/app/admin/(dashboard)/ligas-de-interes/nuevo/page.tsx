import { createInterestLink } from "@/actions/interestLinks";
import { InterestLinkForm } from "../InterestLinkForm";

export default function NewInterestLinkPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Nueva liga de interés</h1>
      <div className="mt-8">
        <InterestLinkForm action={createInterestLink} />
      </div>
    </div>
  );
}
