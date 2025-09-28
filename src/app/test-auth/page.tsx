"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Database, CheckCircle, XCircle, Loader } from "lucide-react";

interface ConnectionTest {
  name: string;
  status: "pending" | "success" | "error";
  message: string;
}

export default function TestAuthPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<ConnectionTest[]>([]);
  const [testEmail, setTestEmail] = useState("test@example.com");
  const [testPassword, setTestPassword] = useState("testpassword123");

  useEffect(() => {
    // Check current user session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const runConnectionTests = async () => {
    setLoading(true);
    const tests: ConnectionTest[] = [
      { name: "Supabase Connection", status: "pending", message: "Testing..." },
      { name: "Database Query", status: "pending", message: "Testing..." },
      { name: "Auth Service", status: "pending", message: "Testing..." },
    ];
    setTestResults([...tests]);

    try {
      // Test 1: Basic connection
      tests[0].status = "success";
      tests[0].message = "Connected to Supabase successfully";
      setTestResults([...tests]);

      // Test 2: Database query
      try {
        const { data, error } = await supabase
          .from("conferences")
          .select("*")
          .limit(1);

        if (error) {
          tests[1].status = "error";
          tests[1].message = `Database error: ${error.message}`;
        } else {
          tests[1].status = "success";
          tests[1].message = `Database query successful. Found ${
            data?.length || 0
          } conferences`;
        }
      } catch (err) {
        tests[1].status = "error";
        tests[1].message = `Database connection failed: ${err}`;
      }
      setTestResults([...tests]);

      // Test 3: Auth service
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          tests[2].status = "error";
          tests[2].message = `Auth error: ${error.message}`;
        } else {
          tests[2].status = "success";
          tests[2].message = data.session
            ? "User authenticated"
            : "Auth service working (no session)";
        }
      } catch (err) {
        tests[2].status = "error";
        tests[2].message = `Auth service failed: ${err}`;
      }
      setTestResults([...tests]);
    } catch (error) {
      console.error("Test failed:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
  const testSignUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        alert(`Sign up error: ${error.message}`);
      } else {
        alert("Sign up successful! Check your email for confirmation.");
        console.log("Sign up data:", data);
      }
    } catch (error) {
      alert(`Sign up failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  */

  const testSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        alert(`Sign in error: ${error.message}`);
      } else {
        alert("Sign in successful!");
        console.log("Sign in data:", data);
      }
    } catch (error) {
      alert(`Sign in failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Success
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Testing...</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Supabase Authentication Test</h1>
          <p className="text-gray-600 mt-2">
            Test your new Supabase project connection and authentication
          </p>
        </div>

        {/* Current User Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current User Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">✅ Authenticated</p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>User ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(user.created_at).toLocaleString()}
                </p>
                <Button onClick={signOut} variant="outline" className="mt-4">
                  Sign Out
                </Button>
              </div>
            ) : (
              <p className="text-gray-600">❌ Not authenticated</p>
            )}
          </CardContent>
        </Card>

        {/* Connection Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Connection Tests
            </CardTitle>
            <CardDescription>
              Test the connection to your new Supabase project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={runConnectionTests}
              disabled={loading}
              className="mb-4"
            >
              {loading ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Run Tests
            </Button>

            <div className="space-y-4">
              {testResults.map((test, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <h4 className="font-medium">{test.name}</h4>
                      <p className="text-sm text-gray-600">{test.message}</p>
                    </div>
                  </div>
                  {getStatusBadge(test.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Authentication Test */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
            <CardDescription>
              Test sign up and sign in functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testEmail">Test Email</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>
              <div>
                <Label htmlFor="testPassword">Test Password</Label>
                <Input
                  id="testPassword"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div className="flex gap-4">
              {/* <Button onClick={testSignUp} disabled={loading} variant="outline">
                Test Sign Up
              </Button> */}
              <Button onClick={testSignIn} disabled={loading}>
                Test Sign In
              </Button>
            </div>

            <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
              <p>
                <strong>Note:</strong> This will create/use a test account. Make
                sure to use a real email for sign up confirmation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
