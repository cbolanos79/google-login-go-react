package main

import (
	"context"
	"fmt"
	"github.com/golang-jwt/jwt"
	"net/http"
	"os"
	"time"

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

type TokenInfo struct {
	Iss           string `json:"iss"`
	Azp           string `json:"azp"`
	Aud           string `json:"aud"`
	Sub           string `json:"sub"`
	Email         string `json:"email"`
	EmailVerified string `json:"email_verified"`
	Nbf           string `json:"nbf"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Locale        string `json:"locale"`
	jwt.StandardClaims
}

// Store information about user profile to be sent as response in login
type UserProfile struct {
	name        string `json:"name"`
	surname     string `json:"surname"`
	picture_url string `json:"picture_url"`
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

		// Extract info from JWT token
		token, _, err := new(jwt.Parser).ParseUnverified(login.Credential, &TokenInfo{})
		if tokenInfo, ok := token.Claims.(*TokenInfo); ok {
			// Check if token is expired
			if time.Now().Unix() > tokenInfo.ExpiresAt {
				return c.JSON(http.StatusUnprocessableEntity, echo.Map{"message": "Expired auth token"})
			}
		}

		// Return HTTP 200 if success
		return c.JSON(http.StatusOK, nil)
	})

	e.Logger.Fatal(e.Start(":8080"))
}
