import { StudioWorkspace } from "@/components/studio/studio-workspace";
import { readProviderSummary } from "@/lib/runtime-config";

export default async function StudioPage() {
  const providerSummary = await readProviderSummary();

  return <StudioWorkspace providerSummary={providerSummary} />;
}
