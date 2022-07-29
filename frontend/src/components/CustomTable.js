import { Table } from "react-super-responsive-table";
import { Input } from "reactstrap";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import "../css/CustomTable.css"

const CustomTable = (props) => {
    return (
        <div className="custom-table-border">
            {props.searchable && <Input placeholder="Search" onChange={props.searchEvent} />}
            
            <Table className="custom-table">
                {props.children}
            </Table>
            
            {props.isEmpty && <div className="custom-table-nodata">No Data Available</div>}
        </div>
    )
}

export default CustomTable;