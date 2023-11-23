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
	Credentials string `json:"credentials"`
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

		if len(login.Credentials) == 0 {
			m := ErrorMessage{"Missing credential value"}
			return c.JSON(http.StatusUnprocessableEntity, &m)
		}

		payload, err := idtoken.Validate(context.Background(), login.Credentials, google_client_id)

		if err != nil {
			return c.JSON(http.StatusUnprocessableEntity, ErrorMessage{fmt.Sprintf("Error validating credentials: %v", err)})
		}
		return c.JSON(http.StatusOK, nil)
	})

	e.Logger.Fatal(e.Start(":8080"))
}
