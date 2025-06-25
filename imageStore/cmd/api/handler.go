package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/go-chi/render"
)

func (app *Config) uploadImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20) // 10 MB

	file, handler, err := r.FormFile("image")
	if err != nil {
		render.JSON(w, r, map[string]string{"error": "Error al recuperar el archivo"})
		return
	}
	defer file.Close()

	fileType := handler.Header.Get("Content-Type")
	if !isValidImageType(fileType) {
		render.JSON(w, r, map[string]string{"error": "Solo se permiten imágenes (jpeg, png, gif)"})
		return
	}

	timestamp := time.Now().UnixNano()
	extension := filepath.Ext(handler.Filename)
	fileName := fmt.Sprintf("%d%s", timestamp, extension)
	savePath := filepath.Join("uploads", fileName)

	// Crear la carpeta si no existe
	os.MkdirAll("uploads", os.ModePerm)

	// Crear el archivo en disco
	dst, err := os.Create(savePath)
	if err != nil {
		render.JSON(w, r, map[string]string{"error": "No se pudo guardar la imagen"})
		return
	}
	defer dst.Close()

	// Copiar contenido
	if _, err := io.Copy(dst, file); err != nil {
		render.JSON(w, r, map[string]string{"error": "Error al guardar el archivo"})
		return
	}

	log.Printf("Imagen guardada: %s (%d bytes)", fileName, handler.Size)

	render.JSON(w, r, map[string]interface{}{
		"status":   "success",
		"filename": fileName,
		"url":      "/images/" + fileName,
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
