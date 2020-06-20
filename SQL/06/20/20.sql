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



