package dao

type User struct {
	Userid   uint   `gorm:"primaryKey; autoIncrement; unique; not null" json:"userid"`
	Username string `gorm:"index; unique; not null" json:"username"`
	Email    string `gorm:"unique; not null" json:"email"`
	Password string `gorm:"not null" json:"password"`
}

type Project struct {
	ProjectId   uint   `gorm:"primaryKey; autoIncrement; unique; not null" json:"project_id"`
	Userid      uint   `gorm:"index; not null" json:"userid"`
	ProjectName string `gorm:"not null" json:"project_name"`
	Status      string `gorm:"not null" json:"status"`
}
