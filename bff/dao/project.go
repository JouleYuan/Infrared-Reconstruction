package dao

type ProjectDM struct {
	isSet       bool
	project     *Project
	projectList []Project
}

func (dm *ProjectDM) GetProject() Project {
	if dm.isSet {
		return *dm.project
	} else {
		return Project{}
	}
}

func (dm *ProjectDM) SetProject(project Project) {
	dm.isSet = true
	dm.project = &project
}

func (dm *ProjectDM) GetProjectList() []Project {
	return dm.projectList
}

func (dm *ProjectDM) GetProjectListByUserid() (err error) {
	dm.projectList = make([]Project, 0)
	res := db.Where("userid = ?", dm.project.Userid).Find(&dm.projectList)
	err = res.Error
	return
}

func (dm *ProjectDM) CreateProject() (err error) {
	res := db.Select("userid", "project_name", "status").Create(dm.project)
	if err = res.Error; err != nil {
		return
	}
	if res.RowsAffected != 1 {
		err = resultInvalidError
		return
	}
	return
}

func (dm *ProjectDM) UpdateProjectNameByProjectId() (err error) {
	res := db.Model(dm.project).Where("project_id = ?", dm.project.ProjectId).Update("project_name", dm.project.ProjectName)
	if err = res.Error; err != nil {
		return
	}
	if res.RowsAffected > 1 {
		err = resultInvalidError
		return
	}
	return
}

func (dm *ProjectDM) UpdateStatusByProjectId() (err error) {
	res := db.Model(dm.project).Where("project_id = ?", dm.project.ProjectId).Update("status", dm.project.ProjectName)
	if err = res.Error; err != nil {
		return
	}
	if res.RowsAffected > 1 {
		err = resultInvalidError
		return
	}
	return
}

func (dm *ProjectDM) DeleteProjectByProjectId() (err error) {
	res := db.Delete(&Project{}, dm.project.ProjectId)
	if err = res.Error; err != nil {
		return
	}
	if res.RowsAffected != 1 {
		err = resultInvalidError
		return
	}
	return
}
