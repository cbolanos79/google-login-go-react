package main

import (
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
)

func main() {
    e := echo.New()
    e.Use(middleware.CORS())

    // TODO: Validate user token with google
    e.Logger.Fatal(e.Start(":8080"))
}
