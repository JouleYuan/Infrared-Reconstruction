package dao

import (
	"errors"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
)

var db *gorm.DB

var resultInvalidError = errors.New("result: invalid")

func Init(username string, password string, host string, port int, schema string) {
	var err error
	dsn := fmt.Sprintf("%s:%s@(%s:%d)/%s", username, password, host, port, schema)
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("%s: Init DB client failed\n", err.Error())
	}
}
