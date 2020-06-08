--------------------------------------------------------
--  File created - Monday-June-08-2020   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Package T3_PACKAGE
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE "T3"."T3_PACKAGE" AS 

    PROCEDURE STORE_ALL ( 
        obj_header IN T3.HEADER_OBJ
        , activities IN T3.ACTIVITY_COLLECTION
        , manpower IN T3.MANPOWER_COLLECTION
        , materials IN T3.MATERIAL_COLLECTION
        , output OUT NUMBER);
        
    PROCEDURE GET_ALL_BY_BARCODE (
        bar_code IN String
        , obj_header OUT T3.HEADER_OBJ
        , act_collection OUT T3.ACTIVITY_COLLECTION
        , manpower_collection OUT T3.MANPOWER_COLLECTION
        , material_collection OUT T3.MATERIAL_COLLECTION
    );
    
    PROCEDURE GET_HEADER_BY_BARCODE (
        bar_code IN String
        , res OUT SYS_REFCURSOR
    );
    
    PROCEDURE GET_DATA_BY_HEADER_ID (
        headerid IN Number
        , tablename IN String
        , res OUT SYS_REFCURSOR
    );
    
    PROCEDURE GET_ACTIVITY_DETAILS(
        activityid IN NUMBER
        , res OUT SYS_REFCURSOR
    );
    
    PROCEDURE GET_ACTIVITY_DOWNTIME(
        activityid IN NUMBER
        , res OUT SYS_REFCURSOR
    );
    
    PROCEDURE TODATE_SAMPLE(date IN string);
    
    PROCEDURE GET_DOWNTIME_TYPES (res OUT SYS_REFCURSOR);
--    PROCEDURE GET_MANPOWER_BY_HEADER_ID (
--        headerid IN Number
--        , res OUT SYS_REFCURSOR
--    );
END T3_PACKAGE;

/
