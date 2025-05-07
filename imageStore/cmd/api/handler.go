package main

import (
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"time"

	"github.com/go-chi/render"
)

func (app *Config) uploadImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("image")
	if err != nil {
		render.JSON(w, r, map[string]string{
			"error": "Error al recuperar el archivo",
		})
		return
	}
	defer file.Close()

	fileType := handler.Header.Get("Content-Type")
	if !isValidImageType(fileType) {
		render.JSON(w, r, map[string]string{
			"error": "Solo se permiten imágenes (jpeg, png, gif)",
		})
		return
	}

	timestamp := time.Now().UnixNano()
	extension := filepath.Ext(handler.Filename)
	fileName := fmt.Sprintf("%d%s", timestamp, extension)

	log.Printf("Imagen procesada: %s (tamaño: %d bytes, tipo: %s)",
		fileName, handler.Size, fileType)

	render.JSON(w, r, map[string]interface{}{
		"status":   "success",
		"filename": fileName,
		"size":     handler.Size,
		"fileType": fileType,
		"origName": handler.Filename,
	})
}

func isValidImageType(fileType string) bool {
	validTypes := map[string]bool{
		"image/jpeg": true,
		"image/jpg":  true,
		"image/png":  true,
		"image/gif":  true,
	}
	return validTypes[fileType]
}
