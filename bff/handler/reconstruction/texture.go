package reconstruction

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"reconstruction/client"
	"reconstruction/dao"
)

func Texture(ctx *gin.Context) {
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
			Type:      client.CmdTypeTexture,
			ProjectId: project.ProjectId,
			Lock:      make(chan bool, 1),
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
			cmd.Lock <- ok
		default:
			ok = false
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"ok": ok,
	})
}
