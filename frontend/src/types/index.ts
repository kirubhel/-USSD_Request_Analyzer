export interface Summary {
    status: string;
    count: number;
  }
  
  export interface RequestResponse {
    correlation_id: string;
    request_time: string;
    response_time: string;
    operation: string;
    status: string;
    reply: string;
    request_data: string;
  }
  
  export interface BlacklistEntry {
    msisdn: string;
    reason: string;
    created_at: string;
  }
  