import { Suspense } from "react";
import DigitalCardClient from "./DigitalCardClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading card...</div>}>
      <DigitalCardClient />
    </Suspense>
  );
}
