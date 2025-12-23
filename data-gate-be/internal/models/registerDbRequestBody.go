package models

type RegisterDbRequestBody struct {
	DBName   string `json:"dbName" validate:"required"`
	UserName string `json:"userName" validate:"required"`
	Password string `json:"password" validate:"required"`
	Host     string `json:"host" validate:"required"`
	Port     int    `json:"port" validate:"required,min=1"`
	DBType   string `json:"dbType" validate:"required,oneof=postgres mysql mongo"`
}
