--------------------------------------------------------
--  File created - Friday-February-28-2020   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Package T3_PACKAGE
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE "T3"."T3_PACKAGE" AS 

TYPE ACTIVITY_COLLECTION IS TABLE OF TBL_ACTIVITY%ROWTYPE;
TYPE MANPOWER_COLLECTION IS TABLE OF TBL_MANPOWER%ROWTYPE;
TYPE MATERIAL_COLLECTION IS TABLE OF TBL_MATERIAL%ROWTYPE;

FUNCTION STORE_ALL ( 
    obj_header TBL_HEADER%ROWTYPE
    , activities ACTIVITY_COLLECTION
    , manpower MANPOWER_COLLECTION
    , materials MATERIAL_COLLECTION) RETURN BOOLEAN;
    
END T3_PACKAGE;

/
