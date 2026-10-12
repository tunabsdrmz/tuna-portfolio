import { notFound } from "next/navigation";
import Stage from "@/components/Stage";
import { TABS, type TabId } from "@/lib/layouts";

export function generateStaticParams() {
  return [{ tab: [] }, ...TABS.filter((t) => t.id !== "index").map((t) => ({ tab: [t.id] }))];
}

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ tab?: string[] }> }) {
  const { tab } = await params;
  const id = (tab?.[0] ?? "index") as TabId;
  if ((tab && tab.length > 1) || !TABS.some((t) => t.id === id)) notFound();
  return <Stage initialTab={id} />;
}
