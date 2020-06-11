--------------------------------------------------------
--  File created - Thursday-June-11-2020   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Type ACCOUNT_OBJ
--------------------------------------------------------

  CREATE OR REPLACE TYPE "T3"."ACCOUNT_OBJ" FORCE AS OBJECT 
(
    ID              NUMBER(10,0),
    FIRST_NAME      VARCHAR(255),
    MIDDLE_NAME     VARCHAR(255),
    LAST_NAME       VARCHAR(255),
    GENDER          VARCHAR(255),
    USER_LEVEL      VARCHAR(255),
    CREATED_AT      VARCHAR(255),
    USERNAME        VARCHAR(255),
    PASSWORD        VARCHAR(255)
)

/
