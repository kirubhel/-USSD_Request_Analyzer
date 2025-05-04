package rabbitmq

import (
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

var Channel *amqp.Channel

func InitRabbitMQ() error {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		return err
	}

	ch, err := conn.Channel()
	if err != nil {
		return err
	}

	_, err = ch.QueueDeclare(
		"blacklist_events", // queue name
		false,              // durable
		false,              // auto-delete
		false,              // exclusive
		false,              // no-wait
		nil,                // arguments
	)
	if err != nil {
		return err
	}

	Channel = ch
	log.Println("✅ RabbitMQ connected and queue declared")
	return nil
}
