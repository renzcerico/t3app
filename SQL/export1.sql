--------------------------------------------------------
--  File created - Friday-February-28-2020   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Package Body T3_PACKAGE
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE BODY "T3"."T3_PACKAGE" AS

  FUNCTION STORE_ALL ( obj_header TBL_HEADER%ROWTYPE
                            , activities ACTIVITY_COLLECTION
                            , manpower MANPOWER_COLLECTION
                            , materials MATERIAL_COLLECTION) 
    RETURN BOOLEAN
    AS
    OBJ_ACTIVITY TBL_ACTIVITY%ROWTYPE;
    OBJ_MANPOWER TBL_MANPOWER%ROWTYPE;
    OBJ_MATERIAL TBL_MATERIAL%ROWTYPE;
  BEGIN
  
    INSERT INTO TBL_HEADER VALUES obj_header;
    
    for i in 1 .. activities.count loop
        obj_activity := activities (i);
        INSERT INTO tbl_activity
        VALUES obj_activity;
    end loop;
    
    for i in 1 .. manpower.count loop
        obj_manpower := manpower (i);
        INSERT INTO tbl_manpower
        VALUES obj_manpower;
    end loop;

    for i in 1 .. materials.count loop
        obj_material := materials (i);
        INSERT INTO tbl_material
        VALUES obj_material;
    end loop;

    RETURN TRUE;
  END STORE_ALL;

END T3_PACKAGE;

/
