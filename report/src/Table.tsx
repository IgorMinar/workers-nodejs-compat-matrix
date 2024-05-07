import type { ReactNode, MouseEventHandler } from "react";

export const TableHeaderCell = ({
  children,
  width,
}: {
  children: ReactNode;
  width: string;
}) => {
  return (
    <th className={`p-1 border border-slate-200 py-2 ${width}`}>{children}</th>
  );
};

export const TableCell = ({ children }: { children: ReactNode }) => {
  return <td className="p-1 border border-slate-200 py-2">{children}</td>;
};

export const TableRow = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLTableRowElement>;
}) => {
  return (
    <tr className="border-slate-200 even:bg-slate-100" onClick={onClick}>
      {children}
    </tr>
  );
};
