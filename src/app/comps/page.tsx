import { redirect } from "next/navigation";
import { getCompEntries } from "@/lib/mdx";
import { getAvailablePatchesFromEntries, getLatestPatch } from "@/lib/patches";

export default async function CompsPage() {
  const targetPatch = await getCompEntries()
    .then((entries) => {
      const availablePatches = getAvailablePatchesFromEntries(entries);
      return getLatestPatch(availablePatches);
    })
    .catch((error) => {
      console.error("Failed to read comp entries", error);
      return null;
    });

  redirect(`/comps/patch/${targetPatch ?? "latest"}`);
}
