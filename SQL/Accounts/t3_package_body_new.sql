create or replace PACKAGE BODY T3_PACKAGE AS
    
    PROCEDURE VALIDATE_USER(user IN VARCHAR2, pass IN VARCHAR2, res OUT SYS_REFCURSOR) AS
    
    BEGIN
        OPEN res FOR
        SELECT id 
               , username
               , first_name
               , middle_name
               , last_name
               , user_level 
               , created_at
        FROM tbl_accounts 
        WHERE username = user AND password = pass;
    END;
    
    PROCEDURE RESET_PASSWORD(acct_id IN NUMBER, res OUT VARCHAR2) AS
    
    BEGIN
        UPDATE tbl_accounts SET password = 'welcome' WHERE id = acct_id;
        COMMIT;
        res := 'y';
    END RESET_PASSWORD;
    
    PROCEDURE GET_ACCOUNT_BY_ID(acct_id IN NUMBER, res OUT SYS_REFCURSOR) AS
    
    BEGIN
        OPEN res FOR
        SELECT a.id
               , a.first_name
               , a.middle_name
               , a.last_name
               , a.gender
               , a.user_level
               , a.created_at
               , a.username
        FROM tbl_accounts a
        WHERE a.id = acct_id;
    END GET_ACCOUNT_BY_ID;

    PROCEDURE GET_ALL_ACCOUNTS(res OUT SYS_REFCURSOR) AS
    
    BEGIN
        OPEN res FOR
        SELECT a.id
               , a.first_name
               , a.middle_name
               , a.last_name
               , a.gender
               , a.user_level
               , a.created_at
               , a.username
        FROM tbl_accounts a ORDER BY a.last_name ASC;
    END GET_ALL_ACCOUNTS;

    PROCEDURE INSERT_ACCOUNTS(OBJ_ACCOUNT IN T3.ACCOUNT_OBJ, ACCT_ID OUT NUMBER) AS
        isExist number; 
    BEGIN
        IF (OBJ_ACCOUNT.ID > 0) THEN
            UPDATE TBL_ACCOUNTS 
            SET FIRST_NAME = OBJ_ACCOUNT.FIRST_NAME
                , MIDDLE_NAME = OBJ_ACCOUNT.MIDDLE_NAME
                , LAST_NAME = OBJ_ACCOUNT.LAST_NAME
                , GENDER = OBJ_ACCOUNT.GENDER
                , USER_LEVEL = OBJ_ACCOUNT.USER_LEVEL
                , USERNAME = OBJ_ACCOUNT.USERNAME
            WHERE ID = OBJ_ACCOUNT.ID;
            COMMIT;
            ACCT_ID := OBJ_ACCOUNT.ID;
        ELSE 
            SELECT count(username) INTO isExist FROM tbl_accounts WHERE username = OBJ_ACCOUNT.USERNAME;
            
            IF (isExist = 0) THEN
                INSERT INTO TBL_ACCOUNTS 
                    VALUES(null
                        , OBJ_ACCOUNT.FIRST_NAME
                        , OBJ_ACCOUNT.MIDDLE_NAME
                        , OBJ_ACCOUNT.LAST_NAME
                        , OBJ_ACCOUNT.GENDER
                        , OBJ_ACCOUNT.USER_LEVEL
                        , SYSDATE
                        , OBJ_ACCOUNT.USERNAME
                        , 'welcome')
                    returning ID INTO ACCT_ID;
            ELSE
                ACCT_ID := 0;
                return;
            END IF;
        END IF;
    END INSERT_ACCOUNTS;
    
    PROCEDURE STORE_ALL ( obj_header IN T3.HEADER_OBJ
                , activities IN T3.ACTIVITY_COLLECTION
                , manpower IN T3.MANPOWER_COLLECTION
                , materials IN T3.MATERIAL_COLLECTION
                , output OUT NUMBER) 
    AS
    OBJ_ACTIVITY T3.ACTIVITY_OBJ;
    OBJ_MANPOWER T3.MANPOWER_OBJ;
    OBJ_MATERIAL T3.MATERIAL_OBJ;
    OBJ_ACTIVITY_DETAILS T3.ACTIVITY_DETAILS_OBJ;
    COL_ACTIVITY_DETAILS T3.ACTIVITY_DETAILS_COLLECTION;
    OBJ_ACTIVITY_DOWNTIME T3.ACTIVITY_DOWNTIME_OBJ;    
    COL_ACTIVITY_DOWNTIME T3.ACTIVITY_DOWNTIME_COLLECTION;
    actid NUMBER;
    BEGIN
        if obj_header.IS_NEW = 1 then
            INSERT INTO tbl_header 
            VALUES ( obj_header.ID                  
                    , obj_header.BARCODE
                    , TO_DATE(obj_header.ACTUAL_START, 'DD-MON-YYYY HH24:MI:SS')
                    , TO_DATE(obj_header.ACTUAL_END, 'DD-MON-YYYY HH24:MI:SS')           
                    , obj_header.STATUS              
                    , obj_header.PO_NUMBER           
                    , obj_header.CONTROL_NUMBER
                    , TO_DATE(obj_header.SHIPPING_DATE, 'DD-MON-YYYY HH24:MI:SS')                      
                    , obj_header.ORDER_QUANTITY      
                    , obj_header.CUSTOMER            
                    , obj_header.CUSTOMER_CODE       
                    , obj_header.CUSTOMER_SPEC       
                    , obj_header.OLD_CODE            
                    , obj_header.INTERNAL_CODE       
                    , obj_header.PRODUCT_DESCRIPTION
                    , obj_header.SHIFT
                    , TO_DATE(obj_header.SCHEDULE_DATE_START, 'DD-MON-YYYY HH24:MI:SS')
                    , TO_DATE(obj_header.SCHEDULE_DATE_END, 'DD-MON-YYYY HH24:MI:SS')
                    , obj_header.FORWARDED_BY
                    , obj_header.REVIEWED_BY                    
                    , obj_header.APPROVED_BY
                    , obj_header.REVIEWED_AT
                    , obj_header.APPROVED_AT
                ) RETURNING ID INTO output;
        else
            if obj_header.IS_CHANGED = 1 then
                UPDATE tbl_header
                SET ACTUAL_END      = TO_DATE(obj_header.ACTUAL_END, 'DD-MON-YYYY HH24:MI:SS'),
                    REVIEWED_AT     = TO_DATE(obj_header.REVIEWED_AT, 'DD-MON-YYYY HH24:MI:SS'),
                    APPROVED_AT     = TO_DATE(obj_header.APPROVED_AT, 'DD-MON-YYYY HH24:MI:SS'),
                    REVIEWED_BY     = obj_header.REVIEWED_BY,
                    FORWARDED_BY    = obj_header.FORWARDED_BY,
                    APPROVED_BY     = obj_header.APPROVED_BY,
                    STATUS          = obj_header.STATUS
                WHERE ID = obj_header.ID;
            end if;
            output := obj_header.ID;
        end if;

        for i in 1 .. activities.count loop
            OBJ_ACTIVITY := activities (i);
            if OBJ_ACTIVITY.IS_NEW = 1 then
                INSERT INTO tbl_activity
                VALUES (
                OBJ_ACTIVITY.ID
                , output
                , TO_DATE(OBJ_ACTIVITY.START_TIME, 'DD-MON-YYYY HH24:MI:SS')
                , TO_DATE(OBJ_ACTIVITY.END_TIME, 'DD-MON-YYYY HH24:MI:SS')
                , OBJ_ACTIVITY.DOWNTIME
                , OBJ_ACTIVITY.REMARKS
                , OBJ_ACTIVITY.LAST_UPDATED_BY
                , CURRENT_DATE
                , CURRENT_DATE
                ) RETURNING ID INTO actid;
            else
                if OBJ_ACTIVITY.IS_CHANGED = 1 then
                    UPDATE tbl_activity
                    SET START_TIME      = TO_DATE(OBJ_ACTIVITY.START_TIME, 'DD-MON-YYYY HH24:MI:SS'),
                        END_TIME        = TO_DATE(OBJ_ACTIVITY.END_TIME, 'DD-MON-YYYY HH24:MI:SS'),
                        DOWNTIME        = OBJ_ACTIVITY.DOWNTIME,
                        REMARKS         = OBJ_ACTIVITY.REMARKS,
                        DATE_UPDATED    = CURRENT_DATE
                    WHERE ID = OBJ_ACTIVITY.ID;
                end if;
                actid := OBJ_ACTIVITY.ID;
            end if;
            COL_ACTIVITY_DETAILS := OBJ_ACTIVITY.ACTIVITY_DETAILS;
            for ii in 1 .. COL_ACTIVITY_DETAILS.count loop
                dbms_output.put_line('lallaa');
                OBJ_ACTIVITY_DETAILS := COL_ACTIVITY_DETAILS (ii);
                if OBJ_ACTIVITY_DETAILS.IS_NEW = 1 then
                    INSERT INTO tbl_activity_details
                    VALUES (
                        OBJ_ACTIVITY_DETAILS.ID
                        , actid
                        , OBJ_ACTIVITY_DETAILS.LOT_NUMBER
                        , OBJ_ACTIVITY_DETAILS.PACKED_QTY
                        , OBJ_ACTIVITY_DETAILS.ADJ_QTY
                    );
                else
                    if OBJ_ACTIVITY_DETAILS.IS_CHANGED = 1 then
                        UPDATE tbl_activity_details
                        SET LOT_NUMBER  = OBJ_ACTIVITY_DETAILS.LOT_NUMBER,
                            PACKED_QTY  = OBJ_ACTIVITY_DETAILS.PACKED_QTY,
                            ADJ_QTY  = OBJ_ACTIVITY_DETAILS.ADJ_QTY
                        WHERE ID = OBJ_ACTIVITY_DETAILS.ID;
                    end if;
                end if;
            end loop;
            COL_ACTIVITY_DOWNTIME := OBJ_ACTIVITY.ACTIVITY_DOWNTIME;
            for ii in 1 .. COL_ACTIVITY_DOWNTIME.count loop
                dbms_output.put_line('lallaa');
                OBJ_ACTIVITY_DOWNTIME := COL_ACTIVITY_DOWNTIME (ii);
                if OBJ_ACTIVITY_DOWNTIME.IS_NEW = 1 then
                    INSERT INTO tbl_activity_downtime
                    VALUES (
                        OBJ_ACTIVITY_DOWNTIME.ID
                        , OBJ_ACTIVITY_DOWNTIME.DOWNTIME_TYPE_ID
                        , OBJ_ACTIVITY_DOWNTIME.MINUTES
                        , OBJ_ACTIVITY_DOWNTIME.REMARKS
                        , OBJ_ACTIVITY_DOWNTIME.QUANTITY
                        , actid
                        , OBJ_ACTIVITY_DOWNTIME.CREATED_BY
                        , CURRENT_DATE
                    );
                else
                    if OBJ_ACTIVITY_DOWNTIME.IS_CHANGED = 1 then
                        UPDATE tbl_activity_downtime
                        SET DOWNTIME_TYPE_ID    = OBJ_ACTIVITY_DOWNTIME.DOWNTIME_TYPE_ID
                            , MINUTES           = OBJ_ACTIVITY_DOWNTIME.MINUTES
                            , REMARKS           = OBJ_ACTIVITY_DOWNTIME.REMARKS
                            , QUANTITY          = OBJ_ACTIVITY_DOWNTIME.QUANTITY
                        WHERE ID = OBJ_ACTIVITY_DOWNTIME.ID;
                    end if;
                end if;
            end loop;            
        end loop;
        --        REC_COUNT := SQL%rowcount;
        for i in 1 .. manpower.count loop
            OBJ_MANPOWER := manpower (i);
            if OBJ_MANPOWER.IS_NEW = 1 then
                if OBJ_MANPOWER.MANPOWER_ID > 0 then
                    INSERT INTO TBL_MANPOWER
                    VALUES (
                        OBJ_MANPOWER.ID
                        ,OBJ_MANPOWER.POSITION_ID
                        ,OBJ_MANPOWER.MANPOWER_ID
                        ,OBJ_MANPOWER.START_TIME
                        ,OBJ_MANPOWER.END_TIME
                        ,OBJ_MANPOWER.REMARKS
                        ,OBJ_MANPOWER.LAST_UPDATED_BY
                        ,CURRENT_DATE
                        ,CURRENT_DATE
                        , output
                    );
                end if;
            else
                if OBJ_MANPOWER.IS_CHANGED = 1 then
                    if OBJ_MANPOWER.MANPOWER_ID > 0 then
                        UPDATE TBL_MANPOWER
                        SET POSITION_ID     = OBJ_MANPOWER.POSITION_ID,
                            MANPOWER_ID     = OBJ_MANPOWER.MANPOWER_ID,
                            START_TIME      = OBJ_MANPOWER.START_TIME,
                            END_TIME        = OBJ_MANPOWER.END_TIME,
                            REMARKS         = OBJ_MANPOWER.REMARKS,
                            DATE_UPDATED    = CURRENT_DATE
                        WHERE ID = OBJ_MANPOWER.ID;
                    end if;
                end if;
            end if;
        end loop;    
--        
        for i in 1 .. materials.count loop
            OBJ_MATERIAL := materials (i);
            if OBJ_MATERIAL.IS_NEW = 1 then
                INSERT INTO TBL_MATERIAL
                VALUES (
                    OBJ_MATERIAL.ID
                    ,OBJ_MATERIAL.QUANTITY
                    ,OBJ_MATERIAL.STANDARD
                    ,OBJ_MATERIAL.REQUIREMENTS
                    ,OBJ_MATERIAL.USED
                    ,OBJ_MATERIAL.REJECT
                    ,OBJ_MATERIAL.REMARKS
                    ,OBJ_MATERIAL.LAST_UPDATED_BY
                    ,CURRENT_DATE
                    ,CURRENT_DATE
                    ,OBJ_MATERIAL.MATERIAL_CODE
                    ,output
                    ,OBJ_MATERIAL.ITEM_CATEGORY
                    ,OBJ_MATERIAL.BOX_TYPE
                    ,OBJ_MATERIAL.MAX_QTY
                    ,OBJ_MATERIAL.MATERIAL_DESC
                );
            else
                if OBJ_MATERIAL.IS_CHANGED = 1 then
                    UPDATE TBL_MATERIAL
                    SET USED = OBJ_MATERIAL.USED,
                        REJECT = OBJ_MATERIAL.REJECT,
                        REMARKS = OBJ_MATERIAL.REMARKS,
                        LAST_UPDATED_BY = OBJ_MATERIAL.LAST_UPDATED_BY,
                        DATE_UPDATED = CURRENT_DATE
                    WHERE ID = OBJ_MATERIAL.ID;
                end if;
            end if;
        end loop;       
        
    END STORE_ALL;

    PROCEDURE GET_ALL_BY_BARCODE (
        bar_code IN String
        , obj_header OUT T3.HEADER_OBJ
        , act_collection OUT T3.ACTIVITY_COLLECTION
        , manpower_collection OUT T3.MANPOWER_COLLECTION
        , material_collection OUT T3.MATERIAL_COLLECTION
    ) AS
    BEGIN
        SELECT  T3.HEADER_OBJ (
            ID
            ,BARCODE
            ,ACTUAL_START
            ,ACTUAL_END
            ,STATUS
            ,PO_NUMBER
            ,CONTROL_NUMBER
            ,SHIPPING_DATE
            ,ORDER_QUANTITY
            ,CUSTOMER
            ,CUSTOMER_CODE
            ,CUSTOMER_SPEC
            ,OLD_CODE
            ,INTERNAL_CODE
            ,PRODUCT_DESCRIPTION
            ,SHIFT
            ,SCHEDULE_DATE_START
            ,SCHEDULE_DATE_END
            ,0
            ,0
            ,FORWARDED_BY
            ,REVIEWED_BY
            ,APPROVED_BY
            ,REVIEWED_AT
            ,APPROVED_AT
        )
        INTO obj_header
        FROM TBL_HEADER
        WHERE BARCODE = bar_code;
        
        SELECT T3.ACTIVITY_OBJ (
            ID
            ,HEADER_ID
            ,START_TIME
            ,END_TIME
            ,DOWNTIME
            ,REMARKS
            ,LAST_UPDATED_BY
            ,DATE_ENTERED
            ,DATE_UPDATED
            ,0
            ,0
        )
        BULK COLLECT INTO act_collection
        FROM TBL_ACTIVITY
        WHERE HEADER_ID = obj_header.ID;
        
        SELECT T3.MANPOWER_OBJ (
            ID
            ,POSITION_ID
            ,MANPOWER_ID
            ,START_TIME
            ,END_TIME
            ,REMARKS
            ,LAST_UPDATED_BY
            ,DATE_ENTERED
            ,DATE_UPDATED
            ,HEADER_ID
            ,0
            ,0
        )
        BULK COLLECT INTO manpower_collection
        FROM TBL_MANPOWER
        WHERE HEADER_ID = obj_header.ID;
        
        SELECT T3.MATERIAL_OBJ (
            ID
            ,QUANTITY
            ,STANDARD
            ,REQUIREMENTS
            ,USED
            ,REJECT
            ,REMARKS
            ,LAST_UPDATED_BY
            ,DATE_ENTERED
            ,DATE_UPDATED
            ,MATERIAL_CODE
            ,HEADER_ID
            ,ITEM_CATEGORY
            ,BOX_TYPE
            ,MAX_QTY
            ,MATERIAL_DESC
            ,0
            ,0
        )
        BULK COLLECT INTO material_collection
        FROM TBL_MATERIAL
        WHERE HEADER_ID = obj_header.ID;
    END GET_ALL_BY_BARCODE;

    PROCEDURE GET_HEADER_BY_BARCODE (
        bar_code IN String
        , res OUT SYS_REFCURSOR
    ) AS
    BEGIN
        OPEN res FOR
        SELECT h.*, (0) AS IS_NEW, (0) AS IS_CHANGED
        FROM TBL_HEADER h
        WHERE BARCODE = bar_code;
    END GET_HEADER_BY_BARCODE;
    
    PROCEDURE GET_DATA_BY_HEADER_ID (
        headerid IN Number
        , tablename IN String
        , res OUT SYS_REFCURSOR
    ) AS
        sort_by String(255);     
    BEGIN
        sort_by := '';
        IF tablename = 'TBL_ACTIVITY' THEN
            sort_by := ' ORDER BY START_TIME DESC, END_TIME DESC';
        ELSIF tablename = 'TBL_MANPOWER' THEN
            sort_by := ' ORDER BY POSITION_ID ASC';
        END IF;
--        IF tablename = 'TBL_MANPOWER' THEN
--            OPEN res FOR
--            SELECT A.*, 0 AS IS_CHANGED, 0 AS IS_NEW
--            FROM (
--                    SELECT 
--                        null AS ID
--                        , 1 AS POSITION_ID
--                        , -1 AS MANPOWER_ID
--                        , '' AS START_TIME
--                        , '' AS END_TIME
--                        , '' AS REMARKS
--                        , null AS LAST_UPDATED_BY
--                        , '' AS DATE_ENTERED
--                        , '' AS DATE_UPDATED
--                        , null AS HEADER_ID
--                    FROM dual UNION ALL
--                    SELECT 
--                        null AS ID
--                        , 2 AS POSITION_ID
--                        , -1 AS MANPOWER_ID
--                        , '' AS START_TIME
--                        , '' AS END_TIME
--                        , '' AS REMARKS
--                        , null AS LAST_UPDATED_BY
--                        , '' AS DATE_ENTERED
--                        , '' AS DATE_UPDATED
--                        , null AS HEADER_ID
--                    FROM dual UNION ALL
--                    SELECT 
--                        null AS ID
--                        , 3 AS POSITION_ID
--                        , -1 AS MANPOWER_ID
--                        , '' AS START_TIME
--                        , '' AS END_TIME
--                        , '' AS REMARKS
--                        , null AS LAST_UPDATED_BY
--                        , '' AS DATE_ENTERED
--                        , '' AS DATE_UPDATED
--                        , null AS HEADER_ID
--                    FROM dual UNION ALL
--                    SELECT 
--                        null AS ID
--                        , 4 AS POSITION_ID
--                        , -1 AS MANPOWER_ID
--                        , '' AS START_TIME
--                        , '' AS END_TIME
--                        , '' AS REMARKS
--                        , null AS LAST_UPDATED_BY
--                        , '' AS DATE_ENTERED
--                        , '' AS DATE_UPDATED
--                        , null AS HEADER_ID
--                    FROM dual UNION ALL
--                    SELECT 
--                        null AS ID
--                        , 5 AS POSITION_ID
--                        , -1 AS MANPOWER_ID
--                        , '' AS START_TIME
--                        , '' AS END_TIME
--                        , '' AS REMARKS
--                        , null AS LAST_UPDATED_BY
--                        , '' AS DATE_ENTERED
--                        , '' AS DATE_UPDATED
--                        , null AS HEADER_ID
--                    FROM dual UNION ALL
--                    SELECT 
--                        null AS ID
--                        , 6 AS POSITION_ID
--                        , -1 AS MANPOWER_ID
--                        , '' AS START_TIME
--                        , '' AS END_TIME
--                        , '' AS REMARKS
--                        , null AS LAST_UPDATED_BY
--                        , '' AS DATE_ENTERED
--                        , '' AS DATE_UPDATED
--                        , null AS HEADER_ID
--                    FROM dual UNION ALL
--                    SELECT 
--                        null AS ID
--                        , 7 AS POSITION_ID
--                        , -1 AS MANPOWER_ID
--                        , '' AS START_TIME
--                        , '' AS END_TIME
--                        , '' AS REMARKS
--                        , null AS LAST_UPDATED_BY
--                        , '' AS DATE_ENTERED
--                        , '' AS DATE_UPDATED
--                        , null AS HEADER_ID
--                    FROM dual
--                ) A INNER JOIN (
--                    SELECT * FROM tbl_manpower WHERE HEADER_ID = headerid
--                ) M
--                ON M.POSITION_ID = A.POSITION_ID
--                ORDER BY A.POSITION_ID;
--        ELSE
            OPEN res FOR 'SELECT t.*, (0) AS IS_NEW, (0) AS IS_CHANGED FROM ' || tablename || ' t WHERE t.HEADER_ID = ' || headerid || sort_by;
--        END IF;
    END GET_DATA_BY_HEADER_ID;

    PROCEDURE GET_ACTIVITY_DETAILS(
        activityid IN NUMBER
        , res OUT SYS_REFCURSOR
    ) AS
    BEGIN
        OPEN res FOR
        SELECT t.*, (0) AS IS_NEW, (0) AS IS_CHANGED
        FROM tbl_activity_details t
        WHERE ACTIVITY_ID = activityid;
    END GET_ACTIVITY_DETAILS;
    
    PROCEDURE GET_ACTIVITY_DOWNTIME(
        activityid IN NUMBER
        , res OUT SYS_REFCURSOR
    ) AS
    BEGIN
        OPEN res FOR
        SELECT ad.*, dt.NAME as DOWNTIME, (0) AS IS_NEW, (0) AS IS_CHANGED
        FROM tbl_activity_downtime ad
        LEFT JOIN tbl_downtime_types dt ON dt.ID = ad.DOWNTIME_TYPE_ID
        WHERE ACTIVITY_ID = activityid;
    END GET_ACTIVITY_DOWNTIME;    

    PROCEDURE TODATE_SAMPLE(date IN String) AS
    BEGIN
        dbms_output.put_line(to_timestamp(date, 'YYYY-MM-DD"T"HH24:MI:SS'));
    END TODATE_SAMPLE;

    PROCEDURE GET_DOWNTIME_TYPES (res OUT SYS_REFCURSOR) AS
    BEGIN
        OPEN res FOR
        SELECT dt.*
        FROM tbl_downtime_types dt;
    END GET_DOWNTIME_TYPES;
    
    PROCEDURE GET_HEADER_COUNT_PER_STATUS ( res OUT SYS_REFCURSOR) AS
    BEGIN
        OPEN res FOR
        SELECT D.STATUS, COUNT(H.STATUS) AS COUNT
        FROM (
            SELECT 1 AS STATUS FROM DUAL UNION ALL
            SELECT 2 AS STATUS FROM DUAL UNION ALL
            SELECT 3 AS STATUS FROM DUAL UNION ALL
            SELECT 4 AS STATUS FROM DUAL
        ) D LEFT JOIN tbl_header H
        ON H.STATUS = D.STATUS
        GROUP BY D.STATUS
        ORDER BY D.STATUS;
    END GET_HEADER_COUNT_PER_STATUS;

    PROCEDURE GET_HEADER_BY_STATUS(
        status_code IN NUMBER
        , header_collection OUT SYS_REFCURSOR
    ) AS
    BEGIN
        OPEN header_collection FOR
        SELECT *
        FROM tbl_header
        WHERE STATUS = status_code; 
    END GET_HEADER_BY_STATUS;

END T3_PACKAGE;