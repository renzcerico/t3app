create or replace PACKAGE T3_PACKAGE AS 

    PROCEDURE STORE_ALL ( 
        obj_header IN T3.HEADER_OBJ
        , activities IN T3.ACTIVITY_COLLECTION
        , manpower IN T3.MANPOWER_COLLECTION
        , materials IN T3.MATERIAL_COLLECTION
        , user_id IN NUMBER
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
    
    PROCEDURE GET_HEADER_COUNT_PER_STATUS (user_id NUMBER DEFAULT 0, res OUT SYS_REFCURSOR);
    
    PROCEDURE GET_HEADER_BY_STATUS(
        status_code IN NUMBER
        , header_collection OUT SYS_REFCURSOR
    );
--    PROCEDURE GET_MANPOWER_BY_HEADER_ID (
--        headerid IN Number
--        , res OUT SYS_REFCURSOR
--    );

    PROCEDURE INSERT_ACCOUNTS(OBJ_ACCOUNT IN T3.ACCOUNT_OBJ, ACCT_ID OUT NUMBER);
    
    PROCEDURE GET_ALL_ACCOUNTS(res OUT SYS_REFCURSOR);
    
    PROCEDURE GET_ACCOUNT_BY_ID(acct_id IN NUMBER, res OUT SYS_REFCURSOR);
    
    PROCEDURE RESET_PASSWORD(acct_id IN NUMBER, res OUT VARCHAR2);
    
    PROCEDURE VALIDATE_USER(user IN VARCHAR2, pass IN VARCHAR2, res OUT SYS_REFCURSOR);
    
    PROCEDURE FORWARD_LIST(userLevel IN VARCHAR2, res OUT SYS_REFCURSOR);

END T3_PACKAGE;