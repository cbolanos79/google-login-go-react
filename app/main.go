package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"google.golang.org/api/idtoken"
)

func main() {
	google_client_id := os.Getenv("GOOGLE_CLIENT_ID")

	e := echo.New()
	e.Use(middleware.CORS())

	// Validate user token with google
	e.POST("/login/google", func(c echo.Context) error {
		// TODO: get credentials from JSON request

		credentials := ""
		payload, err := idtoken.Validate(context.Background(), credentials, client_id)

		// TODO: check if payload is valid
		// TODO: send response
	})

	e.Logger.Fatal(e.Start(":8080"))
}
