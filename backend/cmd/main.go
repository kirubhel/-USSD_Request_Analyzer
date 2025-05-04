package main

import (
	"log"
	"net/http"

	"github.com/kirubhel/backend/internal/handlers"
	"github.com/kirubhel/backend/internal/infra/postgres"
	"github.com/kirubhel/backend/internal/infra/rabbitmq"
)

func main() {
	err := postgres.InitDB()
	if err != nil {
		log.Fatalf("Failed to connect to Postgres: %v", err)
	}

	err = rabbitmq.InitRabbitMQ()
	if err != nil {
		log.Fatalf("❌ Failed to connect to RabbitMQ: %v", err)
	}

	rabbitmq.StartBlacklistConsumer()

	http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write([]byte("pong from backend"))
	})

	http.HandleFunc("/report", withCORS(handlers.GetSummary))
	http.HandleFunc("/latest", withCORS(handlers.GetLatestRequests))
	http.HandleFunc("/blacklist", withCORS(handlers.GetBlacklist))

	http.HandleFunc("/AddToBlacklist", withCORS(handlers.AddToBlacklist))

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func withCORS(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			return
		}
		handler(w, r)
	}
}
