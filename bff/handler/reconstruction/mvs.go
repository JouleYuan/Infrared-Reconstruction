package reconstruction

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func MVS(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"ok": true,
	})
}
