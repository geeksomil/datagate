"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterDbPage() {
  const [form, setForm] = useState({
    host: "",
    port: "",
    dbName: "",
    username: "",
    password: "",
    dbType: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleConnect = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: form.host,
          port: Number(form.port),
          dbName: form.dbName,
          username: form.username,
          password: form.password,
          dbType: form.dbType,
        }),
      });

      const data = await res.json();

      if (data.isSuccess) {
        setMessage("✅ Database connected successfully");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ Unable to reach backend server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Register Database</h2>

          <div>
            <Label>Host</Label>
            <Input
              placeholder="db.example.com"
              value={form.host}
              onChange={(e) => handleChange("host", e.target.value)}
            />
          </div>

          <div>
            <Label>Port</Label>
            <Input
              placeholder="5432"
              value={form.port}
              onChange={(e) => handleChange("port", e.target.value)}
            />
          </div>

          <div>
            <Label>Database Name</Label>
            <Input
              placeholder="company_db"
              value={form.dbName}
              onChange={(e) => handleChange("dbName", e.target.value)}
            />
          </div>

          <div>
            <Label>Username</Label>
            <Input
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          <div>
            <Label>Database Type</Label>
            <Select
              value={form.dbType}
              onValueChange={(value) => handleChange("dbType", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a database type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="postgres">PostgreSQL</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="mongo">MongoDB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect"}
          </Button>

          {message && (
            <p className="text-sm text-center mt-2">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
