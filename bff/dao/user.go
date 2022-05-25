package dao

type UserDM struct {
	isSet bool
	user  *User
}

func (dm *UserDM) GetUser() User {
	if dm.isSet {
		return *dm.user
	} else {
		return User{}
	}
}

func (dm *UserDM) SetUser(user User) {
	dm.isSet = true
	dm.user = &user
}

func (dm *UserDM) CreateUser() (err error) {
	res := db.Select("username", "email", "password").Create(dm.user)
	if err = res.Error; err != nil {
		return
	}
	if res.RowsAffected != 1 {
		err = resultInvalidError
		return
	}
	return
}

func (dm *UserDM) GetUserByUserid() (err error) {
	res := db.Where("userid = ?", dm.user.Userid).Take(dm.user)
	err = res.Error
	return
}

func (dm *UserDM) GetUserByEmail() (err error) {
	res := db.Where("email = ?", dm.user.Email).Take(dm.user)
	err = res.Error
	return
}
