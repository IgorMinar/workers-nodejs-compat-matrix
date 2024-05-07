import { mismatch, stub, supported, unsupported } from "./constants";

export const Legend = () => {
  return (
    <ul className="flex items-center gap-4 border border-slate-300 rounded-md px-4 py-2">
      <li>
        <span className="mr-1 text-sm font-medium">Supported</span>
        <span>{supported}</span>
      </li>
      <li>
        <span className="mr-1 text-sm font-medium">Unsupported</span>
        <span>{unsupported}</span>
      </li>
      <li>
        <span className="mr-1 text-sm font-medium">Mismatch</span>
        <span>{mismatch}</span>
      </li>
      <li>
        <span className="mr-1 text-sm font-medium">Stub</span>
        <span>{stub}</span>
      </li>
    </ul>
  );
};
