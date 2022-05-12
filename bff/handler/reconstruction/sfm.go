package reconstruction

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func SfM(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"ok": true,
	})
}
