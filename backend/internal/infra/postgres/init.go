package postgres

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() error {
	// Replace with your actual DB credentials
	connStr := "postgres://postgres:P@ssw0rd@localhost:5432/ussd_analyzer?sslmode=disable"

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return err
	}

	if err := DB.Ping(); err != nil {
		return err
	}

	log.Println("Connected to Postgres successfully")
	return nil
}
