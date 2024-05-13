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

export const TableCell = ({
  children,
  color,
}: {
  children: ReactNode;
  color?: string;
}) => {
  let bgColor = `transparent`;
  let borderColor = `border-slate-200`;
  switch (color) {
    case "yellow":
      bgColor = "bg-amber-300";
      borderColor = "border-amber-200";
      break;
    case "green":
      bgColor = "bg-emerald-300";
      borderColor = "border-emerald-200";
      break;
    case "red":
      bgColor = "bg-red-300";
      borderColor = "border-red-200";
      break;
    default:
      break;
  }

  return (
    <td className={`p-1 border ${borderColor} py-2 ${bgColor}`}>{children}</td>
  );
};

export const TableRow = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLTableRowElement>;
}) => {
  return (
    <tr className="even:bg-slate-100" onClick={onClick}>
      {children}
    </tr>
  );
};
