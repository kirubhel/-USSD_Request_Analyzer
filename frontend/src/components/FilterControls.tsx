interface Props {
    filterStatus: string;
    filterMsisdn: string;
    setFilterStatus: (val: string) => void;
    setFilterMsisdn: (val: string) => void;
  }
  
  export default function FilterControls({ filterStatus, filterMsisdn, setFilterStatus, setFilterMsisdn }: Props) {
    return (
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          className="px-4 py-2 border rounded bg-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="FAILED">FAILED</option>
        </select>
  
        <input
          type="text"
          placeholder="Filter by MSISDN"
          className="px-4 py-2 border rounded"
          value={filterMsisdn}
          onChange={(e) => setFilterMsisdn(e.target.value)}
        />
      </div>
    );
  }
  