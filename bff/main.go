package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"reconstruction/config"
	"reconstruction/dao"
	"reconstruction/handler/project"
	"reconstruction/handler/reconstruction"
	"reconstruction/handler/user"
)

func main() {
	log.SetFlags(log.Ldate | log.Ltime | log.Llongfile)

	conf := config.GetConfig()
	mysqlCnf := conf.MySQL

	dao.Init(mysqlCnf.Username, mysqlCnf.Password, mysqlCnf.Host, mysqlCnf.Port, mysqlCnf.Schema)

	router := gin.Default()

	router.POST("/account/login", user.Login)
	router.POST("/account/user", user.CreateUser)
	router.GET("/account/user", user.GetUser)

	router.GET("/project/meta", project.GetProjectList)
	router.POST("/project/meta", project.CreateProject)
	router.PUT("/project/meta", project.UpdateProject)
	router.DELETE("/project/meta", project.DeleteProject)

	router.GET("/project/detail", reconstruction.GetProjectDetail)
	router.POST("/project/sfm", reconstruction.SfM)
	router.POST("/project/mvs", reconstruction.MVS)
	router.POST("/project/texture", reconstruction.Texture)

	err := router.Run()
	if err != nil {
		log.Fatalf("%s: Launch HTTP server failed\n", err.Error())
		return
	}
}
