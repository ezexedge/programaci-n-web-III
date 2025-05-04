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

	uploadDir := "./uploads"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		render.JSON(w, r, map[string]string{
			"error": "Error al crear directorio para imágenes",
		})
		return
	}

	timestamp := time.Now().UnixNano()
	extension := filepath.Ext(handler.Filename)
	fileName := fmt.Sprintf("%d%s", timestamp, extension)
	filePath := filepath.Join(uploadDir, fileName)

	dst, err := os.Create(filePath)
	if err != nil {
		render.JSON(w, r, map[string]string{
			"error": "Error al guardar la imagen",
		})
		return
	}
	defer dst.Close()

	if _, err = io.Copy(dst, file); err != nil {
		render.JSON(w, r, map[string]string{
			"error": "Error al guardar la imagen",
		})
		return
	}

	imageURL := fmt.Sprintf("/uploads/%s", fileName)

	log.Println("Imagen guardada exitosamente: %s", filePath)
	render.JSON(w, r, map[string]interface{}{
		"status":   "success",
		"imageUrl": imageURL,
		"filename": fileName,
		"size":     handler.Size,
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
