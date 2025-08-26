import React, { useRef } from "react"
import ReactToPrint from "react-to-print"
import PrintableTable from "./PrintableTable"
import { Button } from "../ui/button"
import { SlPrinter } from "react-icons/sl"
interface Column {
  key: string
  displayName: string
}

interface PrintComponentProps {
  data: Array<{ [key: string]: any }>
  columns: Column[]
}

const PrintComponent: React.FC<PrintComponentProps> = ({ data, columns }) => {
  const componentRef = useRef<HTMLDivElement>(null)

  return (
    <div>
      <ReactToPrint
        trigger={() => (
          <Button
            className=" flex gap-2 text-xs "
            variant={"secondary"}
            size={"sm"}
          >
            <SlPrinter /> Print Data
          </Button>
        )}
        content={() => componentRef.current}
      />
      <div style={{ display: "none" }}>
        <PrintableTable ref={componentRef} data={data} columns={columns} />
      </div>
    </div>
  )
}

export default PrintComponent
