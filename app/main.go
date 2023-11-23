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

type Login struct {
	Credential string `json:"credential"`
}

type ErrorMessage struct {
	Message string `json:"message"`
}

func main() {
	google_client_id := os.Getenv("GOOGLE_CLIENT_ID")

	e := echo.New()
	e.Use(middleware.CORS())

	// Validate user token with google
	e.POST("/login/google", func(c echo.Context) error {
		login := Login{}
		c.Bind(&login)

        // Return HTTP 422 if credential value is not set
		if len(login.Credential) == 0 {
			m := ErrorMessage{"Missing credential value"}
			return c.JSON(http.StatusUnprocessableEntity, &m)
		}

        // Validate credential with google client
        // Omit payload value, but real world application should handle it
		_, err := idtoken.Validate(context.Background(), login.Credential, google_client_id)

        // Return HTTP 422 if there was any error
		if err != nil {
			return c.JSON(http.StatusUnprocessableEntity, ErrorMessage{fmt.Sprintf("Error validating credentials: %v", err)})
		}

        // Return HTTP 200 if success
		return c.JSON(http.StatusOK, nil)
	})

	e.Logger.Fatal(e.Start(":8080"))
}
