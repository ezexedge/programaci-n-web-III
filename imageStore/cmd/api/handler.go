package main

import (
	"net/http"

	"github.com/go-chi/render"
)

type Response struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

func (app *Config) uploadImage(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, map[string]string{
		"message": "soy upload image",
	})
}
