import { Table } from "react-super-responsive-table";
import { Input } from "reactstrap";
import "../css/CustomTable.css"

const CustomTable = (props) => {
    return (
        <div className="custom-table-border">
            {props.searchable && <Input placeholder="Search" onChange={props.searchEvent} />}
            <Table className="custom-table">
                {props.children}
            </Table>
        </div>
    )
    
}

export default CustomTable;