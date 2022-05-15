package client

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"reconstruction/dao"
)

type Cmd struct {
	Type      string
	ProjectId uint
}

const CmdTypeSfm = "sfm"
const CmdTypeMvs = "mvs"
const CmdTypeTexture = "texture"

var CmdQueue = make(chan *Cmd, 100)

func Start() {
	for true {
		cmd := <-CmdQueue
		setStatus(cmd.ProjectId, "Running")
		if reconstruction(cmd) {
			setStatus(cmd.ProjectId, "Success")
			setStatus(cmd.ProjectId, "Failed")
		}
	}
}

func setStatus(projectId uint, status string) {
	dm := dao.ProjectDM{}
	project := dao.Project{}
	project.ProjectId = projectId
	project.Status = status
	dm.SetProject(project)
	err := dm.UpdateStatusByProjectId()
	if err != nil {
		log.Println(err.Error())
	}
}

func reconstruction(cmd *Cmd) bool {
	resp, err := http.Post(fmt.Sprintf("http://65.52.163.88:8080/%s", cmd.Type), "application/json",
		bytes.NewBuffer([]byte(fmt.Sprintf(`{"project_id":%d}`, cmd.ProjectId))))
	if err != nil {
		log.Println(err.Error())
		return false
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err.Error())
		return false
	}
	return string(body) == "ok"
}
