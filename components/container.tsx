import { cn } from "@/lib/utils";

/** Page width container with consistent gutters. */
export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "wide" | "narrow";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 md:px-10",
        size === "default" && "max-w-7xl",
        size === "wide" && "max-w-[100rem]",
        size === "narrow" && "max-w-3xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
