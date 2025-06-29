package main

import (
	"fmt"
	"log"
	"net/http"
)

type Config struct{}

const webPort = "80"

func main() {
	app := Config{}

	log.Println("Starting image-storage service")

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", webPort),
		Handler: app.routes(),
	}

	if err := srv.ListenAndServe(); err != nil {
		log.Panic("Server failed:", err)
	}
}
