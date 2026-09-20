import { cn } from "@/lib/utils";
import { adminCardClass } from "@/lib/admin-ui";

export function AdminCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(adminCardClass, className)}>
      {title || action ? (
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title ? <h2 className="text-base font-semibold text-foreground">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
