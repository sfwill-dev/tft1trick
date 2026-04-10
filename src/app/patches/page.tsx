import { redirect } from "next/navigation";
import { getPatchEntries } from "@/lib/mdx";
import { getAvailablePatchesFromEntries, getLatestPatch } from "@/lib/patches";

export default async function PatchesPage() {
  const targetPatch = await getPatchEntries()
    .then((entries) => {
      const availablePatches = getAvailablePatchesFromEntries(entries);
      return getLatestPatch(availablePatches);
    })
    .catch((error) => {
      console.error("Failed to read patch entries", error);
      return null;
    });

  redirect(`/patches/${targetPatch ?? "latest"}`);
}
