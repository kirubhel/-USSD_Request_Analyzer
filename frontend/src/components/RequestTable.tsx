import { RequestResponse } from "../types";

interface Props {
  requests: RequestResponse[];

  onOpenBlacklistModal: (msisdn: string) => void;
}

export default function RequestTable({
  requests,
  onOpenBlacklistModal,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="relative overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-indigo-100 text-indigo-800">
          <tr>
            <th className="p-4">Time</th>
            <th className="p-4">MSISDN</th>
            <th className="p-4">Voucher</th>
            <th className="p-4">Status</th>
            <th className="p-4">Reply</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests?.map((r) => {
            const [msisdn, voucher] = r.request_data
              ?.match(/\"content\":\"(.*?)\"/)?.[1]
              ?.split("|") ?? ["-", "-"];
            return (
              <tr
                key={r.correlation_id}
                className="even:bg-gray-50 hover:bg-gray-100"
              >
                <td className="p-4 whitespace-nowrap text-gray-700">
                  {" "}
                  {new Date(r.request_time).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="p-4 font-mono text-blue-700">{msisdn}</td>
                <td className="p-4 font-mono text-green-700">{voucher}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      r.status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="p-4 text-gray-600 max-w-[300px]">
  <div className="relative group w-full">
    <span className="truncate block">{r.reply}</span>
    <div
      className="pointer-events-none absolute z-50 hidden group-hover:block bg-white text-gray-800 text-sm p-3 rounded-lg border shadow-xl w-80 -top-28 left-1/2 -translate-x-1/2 transition duration-150"
    >
      {r.reply}
    </div>
  </div>
</td>


                <td className="p-4">
                  {r.status === "FAILED" && (
                    <button
                      onClick={() => onOpenBlacklistModal(msisdn)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Report
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
