import { BlacklistEntry } from "../types";

interface Props {
  blacklist: BlacklistEntry[];
}

export default function BlacklistTable({ blacklist }: Props) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-red-100 text-red-700">
          <tr>
            <th className="p-4">MSISDN</th>
            <th className="p-4">Reason</th>
            <th className="p-4">Blacklisted At</th>
          </tr>
        </thead>
        <tbody>
          {blacklist?.map((b) => (
            <tr key={b.msisdn} className="even:bg-gray-50 hover:bg-red-50">
              <td className="p-4 font-mono text-red-700">{b.msisdn}</td>
              <td className="p-4 text-sm text-gray-700">{b.reason}</td>
              <td className="p-4 text-xs text-gray-500">
                {new Date(b.created_at).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
