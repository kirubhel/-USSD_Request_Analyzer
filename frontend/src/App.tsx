import { useEffect, useState } from "react";
import {
  fetchSummary,
  fetchRequests,
  fetchBlacklist,
  addToBlacklist,
} from "./services/api";
import { Summary, RequestResponse, BlacklistEntry } from "./types";

import Header from "./components/Header";
import StatusChart from "./components/StatusChart";
import FilterControls from "./components/FilterControls";
import RequestTable from "./components/RequestTable";
import Pagination from "./components/Pagination";
import BlacklistTable from "./components/BlacklistTable";

function App() {
  const [summary, setSummary] = useState<Summary[]>([]);
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([]);
  const [pageSize, setPageSize] = useState(10); // default 10

  const [filterStatus, setFilterStatus] = useState("");
  const [filterMsisdn, setFilterMsisdn] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  //showmodal

  const [showModal, setShowModal] = useState(false);
  const [selectedMsisdn, setSelectedMsisdn] = useState("");
  const [remark, setRemark] = useState("Suspicious multiple vouchers");

  useEffect(() => {
    fetchSummary().then((res) => setSummary(res.data));
    fetchRequests().then((res) => setRequests(res.data));
    fetchBlacklist().then((res) => setBlacklist(res.data));
  }, []);

  const handleBlacklist = async () => {
    try {
      await addToBlacklist(selectedMsisdn, remark);
      const updated = await fetchBlacklist();
      setBlacklist(updated.data);
      setShowModal(false);
      setRemark("");
      alert("MSISDN blacklisted successfully");
    } catch {
      alert("Failed to blacklist MSISDN");
    }
  };

  const filteredRequests = requests.filter((r) => {
    const [msisdn] = r.request_data
      ?.match(/\"content\":\"(.*?)\"/)?.[1]
      ?.split("|") ?? ["-"];
    return (
      (filterStatus === "" || r.status === filterStatus) &&
      (filterMsisdn === "" || msisdn.includes(filterMsisdn))
    );
  });

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const onOpenBlacklistModal = (msisdn: string) => {
    setSelectedMsisdn(msisdn);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <Header />

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Status Overview
          </h2>
          {summary.length > 0 && <StatusChart summary={summary} />}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Latest Requests
          </h2>

          <FilterControls
            filterStatus={filterStatus}
            filterMsisdn={filterMsisdn}
            setFilterStatus={setFilterStatus}
            setFilterMsisdn={setFilterMsisdn}
          />
          <div className="flex items-center gap-4 mb-4">
            <label htmlFor="pageSize" className="text-sm text-gray-600">
              Show:
            </label>
            <select
              id="pageSize"
              className="px-3 py-1 border rounded"
              value={pageSize}
              onChange={(e) => {
                const size = Number(e.target.value);
                setPageSize(size);
                fetchRequests(size).then((res) => {
                  setRequests(res.data);
                  setCurrentPage(1); // reset pagination
                });
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={1000}>1000</option>
            </select>
          </div>

          <RequestTable
            requests={paginatedRequests}
            onOpenBlacklistModal={onOpenBlacklistModal}
            //onBlacklist={handleBlacklist}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Blacklisted MSISDNs
          </h2>
          <BlacklistTable blacklist={blacklist} />
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-red-600">
              Blacklist Warning
            </h2>
            <p className="text-gray-700">
              Are you sure you want to blacklist{" "}
              <span className="font-mono">{selectedMsisdn}</span>?
            </p>
            <textarea
              className="w-full border rounded p-2"
              placeholder="Enter reason or remark..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleBlacklist}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
