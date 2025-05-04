package models

type Summary struct {
	Status string `json:"status"`
	Count  int    `json:"count"`
}

type RequestResponse struct {
	CorrelationID string `json:"correlation_id"`
	RequestTime   string `json:"request_time"`
	ResponseTime  string `json:"response_time"`
	Operation     string `json:"operation"`
	Status        string `json:"status"`
	Reply         string `json:"reply"`
	RequestData   string `json:"request_data"`
}

type BlacklistEntry struct {
	MSISDN    string `json:"msisdn"`
	Reason    string `json:"reason"`
	CreatedAt string `json:"created_at"`
}
