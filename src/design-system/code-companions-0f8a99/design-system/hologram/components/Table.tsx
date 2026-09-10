import { type HTMLAttributes, type ReactNode, type TableHTMLAttributes, type ThHTMLAttributes, type TdHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

/** Scroll wrapper + table. Use Th/Td with `numeric` for tabular figures. */
export function Table({ className, children, ...rest }: TableProps) {
  return (
    <div className="holo-table-wrap">
      <table className={cn("holo-table", className)} {...rest}>
        {children}
      </table>
    </div>
  );
}

export function THead({ className, children, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={className} {...rest}>
      {children}
    </thead>
  );
}

export function TBody({ className, children, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={className} {...rest}>
      {children}
    </tbody>
  );
}

export function Tr({ className, children, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={className} {...rest}>
      {children}
    </tr>
  );
}

export interface ThProps extends ThHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
}

export function Th({ numeric, className, children, ...rest }: ThProps) {
  return (
    <th className={cn(numeric && "holo-num", className)} {...rest}>
      {children}
    </th>
  );
}

export interface TdProps extends TdHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
}

export function Td({ numeric, className, children, ...rest }: TdProps) {
  return (
    <td className={cn(numeric && "holo-num", className)} {...rest}>
      {children}
    </td>
  );
}
