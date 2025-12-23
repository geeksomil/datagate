package service

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"g/internal/models"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var validate = validator.New()

func RegisterDb(c *fiber.Ctx) error {
	var body models.RegisterDbRequestBody

	if err := c.BodyParser(&body); err != nil {
		return errorResponse(c, "Invalid request body")
	}

	if err := validate.Struct(&body); err != nil {
		return errorResponse(c, err.Error())
	}

	if err := testConnection(body); err != nil {
		return errorResponse(c, err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"isSuccess": true,
		"message":   "Database connection successful",
	})
}

func testConnection(body models.RegisterDbRequestBody) error {
	switch body.DBType {
	case "postgres":
		return testPostgres(body)
	case "mysql":
		return testMySQL(body)
	case "mongo":
		return testMongo(body)
	default:
		return fmt.Errorf("unsupported database type")
	}
}

func testPostgres(body models.RegisterDbRequestBody) error {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		body.Host, body.Port, body.UserName, body.Password, body.DBName)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return fmt.Errorf("failed to create postgres connection")
	}
	defer db.Close()

	return db.Ping()
}

func testMySQL(body models.RegisterDbRequestBody) error {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s",
		body.UserName, body.Password, body.Host, body.Port, body.DBName)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("failed to create mysql connection")
	}
	defer db.Close()

	return db.Ping()
}

func testMongo(body models.RegisterDbRequestBody) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	uri := fmt.Sprintf("mongodb://%s:%s@%s:%d",
		body.UserName, body.Password, body.Host, body.Port)

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return fmt.Errorf("failed to create mongodb connection")
	}
	defer client.Disconnect(ctx)

	return client.Ping(ctx, nil)
}

func errorResponse(c *fiber.Ctx, msg string) error {
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"isSuccess": false,
		"error":     msg,
	})
}
