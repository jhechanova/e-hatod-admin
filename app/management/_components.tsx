"use client";

import { useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { SearchIcon } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";

type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

export const MOCK_USERS = [
  { id: "1", name: "Maria Santos", email: "maria.santos@example.com", role: "Admin", status: "Active" },
  { id: "2", name: "Juan Dela Cruz", email: "juan.delacruz@example.com", role: "Driver", status: "Active" },
  { id: "3", name: "Ana Reyes", email: "ana.reyes@example.com", role: "Customer", status: "Inactive" },
  { id: "4", name: "Pedro Garcia", email: "pedro.garcia@example.com", role: "Logistics", status: "Active" },
  { id: "5", name: "Carmen Lopez", email: "carmen.lopez@example.com", role: "Customer", status: "Active" },
  { id: "6", name: "Roberto Mendoza", email: "roberto.mendoza@example.com", role: "Driver", status: "Inactive" },
];

export const MOCK_TRANSACTIONS = [
  { id: "T001", trackingNo: "BH-2025-001", customer: "Ana Reyes", amount: "₱450", status: "Delivered", date: "2025-03-05" },
  { id: "T002", trackingNo: "BH-2025-002", customer: "Carmen Lopez", amount: "₱320", status: "In Transit", date: "2025-03-06" },
  { id: "T003", trackingNo: "BH-2025-003", customer: "Juan Dela Cruz", amount: "₱890", status: "Pending", date: "2025-03-07" },
  { id: "T004", trackingNo: "BH-2025-004", customer: "Maria Santos", amount: "₱210", status: "Delivered", date: "2025-03-04" },
  { id: "T005", trackingNo: "BH-2025-005", customer: "Pedro Garcia", amount: "₱550", status: "Cancelled", date: "2025-03-03" },
  { id: "T006", trackingNo: "BH-2025-006", customer: "Roberto Mendoza", amount: "₱780", status: "In Transit", date: "2025-03-06" },
];

const userColumns = [
  { key: "name", label: "Name", allowsSorting: true },
  { key: "email", label: "Email", allowsSorting: true },
  { key: "role", label: "Role", allowsSorting: true },
  { key: "status", label: "Status", allowsSorting: true },
];

const transactionColumns = [
  { key: "trackingNo", label: "Tracking No.", allowsSorting: true },
  { key: "customer", label: "Customer", allowsSorting: true },
  { key: "amount", label: "Amount", allowsSorting: true },
  { key: "status", label: "Status", allowsSorting: true },
  { key: "date", label: "Date", allowsSorting: true },
];

const USER_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export function UsersTable() {
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [appliedName, setAppliedName] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const handleSearch = () => {
    setAppliedName(filterName);
    setAppliedStatus(filterStatus);
  };

  const handleClear = () => {
    setFilterName("");
    setFilterStatus("all");
    setAppliedName("");
    setAppliedStatus("all");
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = MOCK_USERS.filter((u) => {
      const matchesName = !appliedName || u.name.toLowerCase().includes(appliedName.toLowerCase());
      const matchesStatus = !appliedStatus || appliedStatus === "all" || u.status === appliedStatus;
      return matchesName && matchesStatus;
    });
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortDescriptor.column as keyof (typeof MOCK_USERS)[0]];
      const bVal = b[sortDescriptor.column as keyof (typeof MOCK_USERS)[0]];
      const cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""));
      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });
    return filtered;
  }, [appliedName, appliedStatus, sortDescriptor]);

  return (
    <div className="space-y-4">
      <div className="flex flex-nowrap items-end gap-4">
        <Input
          aria-label="Filter by name"
          className="min-w-[200px]"
          classNames={{
            inputWrapper:
              "bg-white border border-[var(--dashboard-content-border)]",
          }}
          label="Name"
          placeholder="Filter by name..."
          value={filterName}
          onValueChange={setFilterName}
        />
        <Select
          aria-label="Filter by status"
          classNames={{
            trigger:
              "bg-white border border-[var(--dashboard-content-border)] min-w-[140px]",
          }}
          label="Status"
          placeholder="All"
          selectedKeys={[filterStatus]}
          onSelectionChange={(keys) => {
            const v = Array.from(keys)[0];
            setFilterStatus(v ? String(v) : "all");
          }}
        >
          {USER_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value}>{opt.label}</SelectItem>
          ))}
        </Select>
        <Button
          className="bg-[var(--auth-input)] text-white shrink-0"
          startContent={<SearchIcon className="h-5 w-5" />}
          onPress={handleSearch}
        >
          Search
        </Button>
        <Button
          className="border border-[var(--dashboard-content-border)] bg-white text-[var(--dashboard-text-on-light)] shrink-0"
          variant="bordered"
          onPress={handleClear}
        >
          Clear
        </Button>
      </div>
      <Table
        aria-label="Users table"
        classNames={{
          wrapper:
            "bg-white border border-[var(--dashboard-content-border)] rounded-lg shadow-sm",
        }}
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) =>
          setSortDescriptor(descriptor as SortDescriptor)
        }
      >
        <TableHeader columns={userColumns}>
          {(column) => (
            <TableColumn key={column.key} allowsSorting={column.allowsSorting}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={filteredAndSortedUsers} emptyContent="No users found">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {item[columnKey as keyof typeof item]}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const TRANSACTION_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Delivered", label: "Delivered" },
  { value: "In Transit", label: "In Transit" },
  { value: "Pending", label: "Pending" },
  { value: "Cancelled", label: "Cancelled" },
];

export function TransactionsTable() {
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [appliedCustomer, setAppliedCustomer] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });

  const handleSearch = () => {
    setAppliedCustomer(filterCustomer);
    setAppliedStatus(filterStatus);
  };

  const handleClear = () => {
    setFilterCustomer("");
    setFilterStatus("all");
    setAppliedCustomer("");
    setAppliedStatus("all");
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = MOCK_TRANSACTIONS.filter((t) => {
      const matchesCustomer =
        !appliedCustomer ||
        t.customer.toLowerCase().includes(appliedCustomer.toLowerCase());
      const matchesStatus = !appliedStatus || appliedStatus === "all" || t.status === appliedStatus;
      return matchesCustomer && matchesStatus;
    });
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortDescriptor.column as keyof (typeof MOCK_TRANSACTIONS)[0]];
      const bVal = b[sortDescriptor.column as keyof (typeof MOCK_TRANSACTIONS)[0]];
      const cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""));
      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });
    return filtered;
  }, [appliedCustomer, appliedStatus, sortDescriptor]);

  return (
    <div className="space-y-4">
      <div className="flex flex-nowrap items-end gap-4">
        <Input
          aria-label="Filter by customer"
          className="min-w-[200px]"
          classNames={{
            inputWrapper:
              "bg-white border border-[var(--dashboard-content-border)]",
          }}
          label="Customer"
          placeholder="Filter by customer..."
          value={filterCustomer}
          onValueChange={setFilterCustomer}
        />
        <Select
          aria-label="Filter by status"
          classNames={{
            trigger:
              "bg-white border border-[var(--dashboard-content-border)] min-w-[140px]",
          }}
          label="Status"
          placeholder="All"
          selectedKeys={[filterStatus]}
          onSelectionChange={(keys) => {
            const v = Array.from(keys)[0];
            setFilterStatus(v ? String(v) : "all");
          }}
        >
          {TRANSACTION_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value}>{opt.label}</SelectItem>
          ))}
        </Select>
        <Button
          className="bg-[var(--auth-input)] text-white shrink-0"
          startContent={<SearchIcon className="h-5 w-5" />}
          onPress={handleSearch}
        >
          Search
        </Button>
        <Button
          className="border border-[var(--dashboard-content-border)] bg-white text-[var(--dashboard-text-on-light)] shrink-0"
          variant="bordered"
          onPress={handleClear}
        >
          Clear
        </Button>
      </div>
      <Table
        aria-label="Transactions table"
        classNames={{
          wrapper:
            "bg-white border border-[var(--dashboard-content-border)] rounded-lg shadow-sm",
        }}
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) =>
          setSortDescriptor(descriptor as SortDescriptor)
        }
      >
        <TableHeader columns={transactionColumns}>
          {(column) => (
            <TableColumn key={column.key} allowsSorting={column.allowsSorting}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filteredAndSortedTransactions}
          emptyContent="No transactions found"
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {item[columnKey as keyof typeof item]}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
