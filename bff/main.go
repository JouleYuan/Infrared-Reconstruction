package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"reconstruction/client"
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
	client.Start()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:  []string{"*"},
		AllowMethods:  []string{"*"},
		AllowHeaders:  []string{"*"},
		ExposeHeaders: []string{"*"},
	}))

	router.POST("/account/login", user.Login)
	router.POST("/account/create_user", user.CreateUser)
	router.POST("/account/get_user", user.GetUser)

	router.POST("/project/get_meta", project.GetProjectList)
	router.POST("/project/create_meta", project.CreateProject)
	router.POST("/project/update_meta", project.UpdateProject)
	router.POST("/project/delete_meta", project.DeleteProject)

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
