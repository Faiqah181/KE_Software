import React from "react";
import "../css/InstallmentTable.css"

const InstallmentTable = (props) => {
    return (    
        <div className="installment-table-outer">
            <div className="installment-table-inner" ref={props.tableRef}>
                <table>
                    {props.children}
                </table>
            </div>
        </div>
    )    
}

export default InstallmentTable;