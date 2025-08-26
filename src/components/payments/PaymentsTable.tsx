import React from "react"
import { Badge } from "../ui/badge"

type Payment = {
  amount: number
  fee: number
  provider: string
  status: string
  processed_at: string
  initiated_at: string
  ref: string
  phone: string
}

type PaymentsTableProps = {
  payments: Payment[]
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2 border-b">Amount</th>
            <th className="text-left px-4 py-2 border-b">Fee</th>
            <th className="text-left px-4 py-2 border-b">Provider</th>
            <th className="text-left px-4 py-2 border-b">Status</th>
            <th className="text-left px-4 py-2 border-b">Processed At</th>
            <th className="text-left px-4 py-2 border-b">Initiated At</th>
            <th className="text-left px-4 py-2 border-b">Reference</th>
            <th className="text-left px-4 py-2 border-b">Phone</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{p.amount}</td>
              <td className="px-4 py-2 border-b">{p.fee}</td>
              <td className="px-4 py-2 border-b">{p.provider}</td>
              <td className="px-4 py-2 border-b capitalize">
                {p.status == "failed" ? (
                  <>
                    <Badge className=" bg-red-100 text-red-700 hover:bg-red-100">
                      {" "}
                      Failed
                    </Badge>
                  </>
                ) : p.status == "pending" ? (
                  <Badge className=" bg-yellow-100 text-yellow-700 hover:bg-green-100">
                    {" "}
                    Pending
                  </Badge>
                ) : p.status == "success" ? (
                  <>
                    <Badge className=" bg-green-100 text-green-700 hover:bg-green-100">
                      {" "}
                      paid
                    </Badge>
                  </>
                ) : null}
              </td>
              <td className="px-4 py-2 border-b">{p.processed_at}</td>
              <td className="px-4 py-2 border-b">{p.initiated_at}</td>
              <td className="px-4 py-2 border-b">{p.ref}</td>
              <td className="px-4 py-2 border-b">{p.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PaymentsTable
