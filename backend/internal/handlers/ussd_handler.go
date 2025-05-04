package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/kirubhel/backend/internal/infra/postgres"
	"github.com/kirubhel/backend/internal/infra/rabbitmq"
	"github.com/kirubhel/backend/internal/models"
	amqp "github.com/rabbitmq/amqp091-go"
)

// GET /report
func GetSummary(w http.ResponseWriter, r *http.Request) {
	rows, err := postgres.DB.Query(`SELECT status, COUNT(*) FROM ussd_responses GROUP BY status`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var summaries []models.Summary
	for rows.Next() {
		var s models.Summary
		if err := rows.Scan(&s.Status, &s.Count); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		summaries = append(summaries, s)
	}
	json.NewEncoder(w).Encode(summaries)
}

// GET /latest?n=10
func GetLatestRequests(w http.ResponseWriter, r *http.Request) {
	nStr := r.URL.Query().Get("n")
	n, err := strconv.Atoi(nStr)
	if err != nil || n <= 0 {
		n = 10
	}
	query := `
	SELECT req.correlation_id, req.timestamp, res.timestamp, req.operation, res.status, res.reply, req.request_data
	FROM ussd_requests req
	JOIN ussd_responses res ON req.correlation_id = res.correlation_id
	ORDER BY req.timestamp DESC
	LIMIT $1
	`
	rows, err := postgres.DB.Query(query, n)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var results []models.RequestResponse
	for rows.Next() {
		var r models.RequestResponse
		if err := rows.Scan(&r.CorrelationID, &r.RequestTime, &r.ResponseTime, &r.Operation, &r.Status, &r.Reply, &r.RequestData); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		results = append(results, r)
	}
	json.NewEncoder(w).Encode(results)
}

// GET /blacklist
func GetBlacklist(w http.ResponseWriter, r *http.Request) {
	rows, err := postgres.DB.Query(`SELECT msisdn, reason, created_at FROM blacklist`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var list []models.BlacklistEntry
	for rows.Next() {
		var b models.BlacklistEntry
		if err := rows.Scan(&b.MSISDN, &b.Reason, &b.CreatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		list = append(list, b)
	}
	json.NewEncoder(w).Encode(list)
}

type AddToBlacklistRequest struct {
	MSISDN string `json:"msisdn"`
	Reason string `json:"reason"`
}

func AddToBlacklist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	var req AddToBlacklistRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	_, err := postgres.DB.Exec(`
		INSERT INTO blacklist (msisdn, reason, created_at)
		VALUES ($1, $2, $3)
		ON CONFLICT (msisdn) DO NOTHING
	  `, req.MSISDN, req.Reason, time.Now())

	if err != nil {
		log.Println("Insert error:", err)
		http.Error(w, "Failed to insert blacklist entry", http.StatusInternalServerError)
		return
	}

	payload, _ := json.Marshal(req)

	err = rabbitmq.Channel.Publish(
		"",                 // default exchange
		"blacklist_events", // queue name
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        payload,
		},
	)
	if err != nil {
		log.Println("❌ Failed to publish to RabbitMQ:", err)
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "MSISDN successfully blacklisted",
	})
}
