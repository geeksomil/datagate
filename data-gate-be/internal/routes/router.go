package routes

import (
	"g/internal/service"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// Router initializes and returns the Fiber app
func Router() *fiber.App {
	app := fiber.New()

	// Global logging middleware
	app.Use(loggingMiddleware)
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // allow all origins, or set "http://localhost:3000" for frontend only
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// Health check
	app.Get("/health", healthHandler)

	// Register DB
	app.Post("/register", service.RegisterDb)

	// API group
	api := app.Group("/api")
	api.All("/*", apiNotImplemented)

	return app
}

func healthHandler(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "ok",
	})
}

func apiNotImplemented(c *fiber.Ctx) error {
	return c.Status(fiber.StatusNotImplemented).SendString("not implemented")
}

func loggingMiddleware(c *fiber.Ctx) error {
	start := time.Now()

	err := c.Next()

	log.Printf("%s %s %s", c.Method(), c.Path(), time.Since(start))
	return err
}
