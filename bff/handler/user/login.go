package user

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"reconstruction/dao"
	"strconv"
)

func Login(ctx *gin.Context) {
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
		err = dm.GetUserByEmail()
		if err != nil {
			log.Println(err.Error())
			ok = false
		}
		if ok {
			ok = user.Password == dm.GetUser().Password
		}
	}

	ctx.SetCookie("userid", strconv.Itoa(int(user.Userid)), 60*60, "/", "localhost", true, true)
	ctx.JSON(http.StatusOK, gin.H{
		"ok": ok,
	})
}
