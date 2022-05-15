package reconstruction

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"reconstruction/client"
	"reconstruction/dao"
)

func MVS(ctx *gin.Context) {
	ok := true
	dm := dao.ProjectDM{}

	project := dao.Project{}
	err := ctx.BindJSON(&project)
	if err != nil {
		log.Println(err.Error())
		ok = false
	}

	if ok {
		cmd := client.Cmd{
			Type:      client.CmdTypeMvs,
			ProjectId: project.ProjectId,
		}

		select {
		case client.CmdQueue <- &cmd:
			project.Status = "Pending"
			dm.SetProject(project)
			err = dm.UpdateStatusByProjectId()
			if err != nil {
				log.Println(err.Error())
				ok = false
			}
		default:
			ok = false
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok": ok,
	})
}
