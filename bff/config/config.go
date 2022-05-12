package config

import (
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
)

type Yaml struct {
	MySQL `yaml:"mysql"`
}

type MySQL struct {
	Username string `yaml:"username"`
	Password string `yaml:"password"`
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	Schema   string `yaml:"schema"`
}

func GetConfig() *Yaml {
	yamlFile, err := ioutil.ReadFile("./conf.yaml")
	if err != nil {
		log.Fatalf("%s: Read conf.yaml failed", err.Error())
	}

	conf := Yaml{}
	err = yaml.Unmarshal(yamlFile, &conf)
	if err != nil {
		log.Fatalf("%s: Unmarshal conf.yaml failed", err.Error())
	}

	return &conf
}
