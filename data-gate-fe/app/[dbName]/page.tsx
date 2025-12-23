"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type Column = { name: string; type: string; isNullable: boolean };
type TableSchema = { tableName: string; columns: Column[] };

type RolePermission = {
  tableName: string;
  columns: string[];
  rowFilter?: string; // e.g., "department='HR'"
};

export default function DBSchemaPage() {
  const backendBaseUrl = "http://localhost:8080";
  const [schema, setSchema] = useState<TableSchema[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");
  const [permissions, setPermissions] = useState<Record<string, RolePermission>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
    const fetchSchema = async () => {
    try {
      const res = await fetch(`${backendBaseUrl}/db-scema`);
      const data = await res.json();
      if (data.success) setSchema(data.tables);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${backendBaseUrl}/roles`);
      const data = await res.json();
      if (data.success) setRoles(data.roles);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
  const fetchData = async () => {
    await fetchSchema();
    await fetchRoles();
  };
  fetchData();
}, []);

  const handleColumnToggle = (table: string, column: string) => {
    setPermissions((prev) => {
      const tablePerm = prev[table] || { tableName: table, columns: [] };
      const exists = tablePerm.columns.includes(column);
      const updatedColumns = exists
        ? tablePerm.columns.filter((c) => c !== column)
        : [...tablePerm.columns, column];
      return { ...prev, [table]: { ...tablePerm, columns: updatedColumns } };
    });
  };

  const handleCreateRole = async () => {
    if (!newRole) return;

    try {
      const res = await fetch(`${backendBaseUrl}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRole, permissions: Object.values(permissions) }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Role "${newRole}" created`);
        setRoles((prev) => [...prev, newRole]);
        setNewRole("");
        setPermissions({});
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ Failed to create role");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Database Tables & Roles</h1>

      {/* New Role Creation */}
      <Card className="mb-6">
        <CardContent className="space-y-2">
          <Label>New Role Name</Label>
          <Input value={newRole} onChange={(e) => setNewRole(e.target.value)} />
          <Button onClick={handleCreateRole}>Create Role with Selected Permissions</Button>
        </CardContent>
      </Card>

      {/* Tables and Columns */}
      {schema.map((table) => (
        <Card key={table.tableName} className="mb-4">
          <CardContent>
            <h2 className="font-semibold">{table.tableName}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {table.columns.map((col) => (
                <div key={col.name} className="flex items-center gap-1">
                  <Checkbox
                    checked={permissions[table.tableName]?.columns?.includes(col.name) || false}
                    onCheckedChange={() => handleColumnToggle(table.tableName, col.name)}
                  />
                  <span>{col.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
