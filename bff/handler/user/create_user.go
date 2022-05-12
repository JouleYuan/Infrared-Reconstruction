package user

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"reconstruction/dao"
)

func CreateUser(ctx *gin.Context) {
	ok := true
	dm := dao.UserDM{}

	user := dao.User{}
	err := ctx.BindJSON(&user)
	if err != nil {
		log.Println(err.Error())
		ok = false
	}

	if ok {
		dm.SetUser(user)
		err = dm.CreateUser()
		if err != nil {
			log.Println(err.Error())
			ok = false
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok": ok,
	})
}
