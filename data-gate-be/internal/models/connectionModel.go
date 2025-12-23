package models

import (
	"time"
)

// Connection represents a row in the "connections" table
type Connection struct {
	ID        string    `db:"id"` // MySQL auto-generates this
	Host      string    `db:"host"`
	Port      int       `db:"port"`
	DBName    string    `db:"db_name"`
	Username  string    `db:"username"`
	Password  string    `db:"password"`
	DBType    string    `db:"db_type"`
	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
	Email     string    `gorm:"type:varchar(255);not null"` // NEW
}
