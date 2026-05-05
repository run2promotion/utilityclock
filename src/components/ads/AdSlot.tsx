import { isFeatureEnabled } from "@/lib/feature-flags";

type AdSlotProps = {
  slotId: string;
  className?: string;
  routeType: "hub" | "tool";
};

export function AdSlot({ slotId, className, routeType }: AdSlotProps) {
  if (!isFeatureEnabled("adExperiments")) return null;
  if (routeType === "tool") return null;

  return (
    <section
      data-ad-slot={slotId}
      className={`min-h-24 rounded-xl border border-zinc-200/80 bg-zinc-100/70 p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 ${className ?? ""}`}
      aria-label="Advertisement"
    >
      Ad experiment slot (`{slotId}`) reserved with stable height to avoid layout shift.
    </section>
  );
}
