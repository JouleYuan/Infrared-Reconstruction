package project

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"reconstruction/dao"
)

func UpdateProject(ctx *gin.Context) {
	ok := true
	dm := dao.ProjectDM{}

	project := dao.Project{}
	err := ctx.BindJSON(&project)
	if err != nil {
		log.Println(err.Error())
		ok = false
	}

	if ok {
		dm.SetProject(project)
		err = dm.UpdateProjectNameByProjectId()
		if err != nil {
			log.Println(err.Error())
			ok = false
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok": ok,
	})
}
