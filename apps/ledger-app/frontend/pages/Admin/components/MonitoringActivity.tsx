import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data - replace with real data from API
const mockMintingHistory = [
  {
    address: "0x1234...5678",
    fee: 0.1,
    timestamp: "2024-03-27T10:00:00Z",
  },
  {
    address: "0x8765...4321",
    fee: 0.15,
    timestamp: "2024-03-27T09:30:00Z",
  },
];

const mockFeeMetrics = [
  { date: "2024-03-21", amount: 0.5 },
  { date: "2024-03-22", amount: 0.8 },
  { date: "2024-03-23", amount: 1.2 },
  { date: "2024-03-24", amount: 0.9 },
  { date: "2024-03-25", amount: 1.5 },
  { date: "2024-03-26", amount: 1.1 },
  { date: "2024-03-27", amount: 0.7 },
];

export function MonitoringActivity() {
  const totalFees = mockFeeMetrics.reduce((sum, day) => sum + day.amount, 0);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="heading-md">Fee Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="heading-sm mb-2">Total Fees Earned</h3>
            <p className="title-md">{totalFees.toFixed(2)} 📒</p>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockFeeMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} 📒`} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="heading-md">Minting History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Fee (📒)</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMintingHistory.map((mint, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono">{mint.address}</TableCell>
                  <TableCell>{mint.fee.toFixed(2)} 📒</TableCell>
                  <TableCell>
                    {new Date(mint.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 