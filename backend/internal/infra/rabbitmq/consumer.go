package rabbitmq

import (
	"encoding/json"
	"log"
	"time"

	"github.com/kirubhel/backend/internal/infra/postgres"
)

type BlacklistEvent struct {
	MSISDN string `json:"msisdn"`
	Reason string `json:"reason"`
}

func StartBlacklistConsumer() {
	msgs, err := Channel.Consume(
		"blacklist_events", // queue name
		"",                 // consumer tag
		true,               // auto-ack
		false,              // exclusive
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("❌ Failed to start consumer: %v", err)
	}

	go func() {
		for msg := range msgs {
			var event BlacklistEvent
			if err := json.Unmarshal(msg.Body, &event); err != nil {
				log.Println("❌ Failed to parse event:", err)
				continue
			}

			log.Printf("📥 Blacklist event received for %s | Reason: %s", event.MSISDN, event.Reason)

			// 📨 Simulate sending SMS
			log.Printf("📨 SMS sent to %s: You have been blacklisted due to: %s", event.MSISDN, event.Reason)

			// 📝 Log to blacklist_events_log table
			_, err := postgres.DB.Exec(`
				INSERT INTO blacklist_events_log (msisdn, reason, source, event_time)
				VALUES ($1, $2, $3, $4)
			`, event.MSISDN, event.Reason, "RabbitConsumer", time.Now())
			if err != nil {
				log.Printf("❌ Failed to log blacklist event: %v", err)
			} else {
				log.Printf("✅ Blacklist event logged for %s", event.MSISDN)
			}

			// 🔔 Simulate notifying external system
			log.Printf("🔔 Alert sent to Fraud Monitoring API for %s", event.MSISDN)
		}
	}()
}
