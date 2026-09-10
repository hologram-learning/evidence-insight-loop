import { cn } from "../lib/cn";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** id of the selected tab. */
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div className={cn("holo-tabs", className)} role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === value}
          disabled={item.disabled}
          onClick={() => onChange(item.id)}
          className={cn("holo-tab", item.id === value && "holo-tab--active")}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
