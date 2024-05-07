import { mismatch, stub, supported, unsupported } from "./constants";

export const Legend = () => {
  return (
    <table className="mb-10 table-fixed border border-slate-200 p-5 border-collapse">
      <thead>
        <tr>
          <th className="min-w-[15ch] p-1 border border-slate-200">Icon</th>
          <th className="min-w-[15ch] p-1 border border-slate-200">Meaning</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-1 border border-slate-200">Supported</td>
          <td className="p-1 border border-slate-200">{supported}</td>
        </tr>
        <tr>
          <td className="p-1 border border-slate-200">Unsupported</td>
          <td className="p-1 border border-slate-200">{unsupported}</td>
        </tr>
        <tr>
          <td className="p-1 border border-slate-200">Stub</td>
          <td className="p-1 border border-slate-200">{stub}</td>
        </tr>
        <tr>
          <td className="p-1 border border-slate-200">Mismatch</td>
          <td className="p-1 border border-slate-200">{mismatch}</td>
        </tr>
      </tbody>
    </table>
  );
};
