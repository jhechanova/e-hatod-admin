"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { EyeIcon, EyeSlashIcon, SearchIcon } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--auth-bg)] px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center gap-4">
          <Avatar
            className="h-24 w-24 bg-[var(--auth-input)]"
            icon={<span className="text-4xl">🚗</span>}
            name="BOHOL e-Hatod"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--dashboard-text-on-light)]">
              BOHOL
            </h1>
            <h1 className="text-xl font-bold text-[var(--dashboard-text-on-light)]">
              e-Hatod
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-[var(--dashboard-text-on-light)]">
            Welcome
          </h2>
        </div>

        {/* Login Form */}
        <div className="rounded-xl border border-[var(--dashboard-content-border)] bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-[var(--dashboard-text-on-light)]"
                htmlFor="login-username"
              >
                Username
              </label>
              <Input
                id="login-username"
                aria-label="Username"
                classNames={{
                  inputWrapper:
                    "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                }}
                placeholder="Enter username"
                value={username}
                onValueChange={setUsername}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-[var(--dashboard-text-on-light)]"
                htmlFor="login-password"
              >
                Password
              </label>
              <Input
                id="login-password"
                aria-label="Password"
                classNames={{
                  inputWrapper:
                    "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                }}
                endContent={
                  <button
                    aria-label="Toggle password visibility"
                    className="text-[var(--auth-input-text)] focus:outline-none"
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                }
                placeholder="Enter password"
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onValueChange={setPassword}
              />
              <p className="mt-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
                Password must be at least 8 characters combination of letter/s,
                number/s, and special character/s.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Checkbox
                classNames={{
                  label: "text-sm text-[var(--dashboard-text-on-light)]",
                }}
                size="sm"
              >
                Remember Me
              </Checkbox>
              <Checkbox
                classNames={{
                  label: "text-sm text-[var(--dashboard-text-on-light)]",
                }}
                size="sm"
              >
                Forgot Password?
              </Checkbox>
            </div>

            <Button
              className="w-full bg-[var(--auth-input)] text-white"
              size="lg"
              variant="flat"
              onPress={() => router.push("/dashboard")}
            >
              Sign In
            </Button>

            <p className="text-center text-sm text-[var(--dashboard-text-on-light)]">
              Don&apos;t have an account yet?{" "}
              <NextLink
                className="font-medium text-[var(--auth-input)] underline"
                href="/signup"
              >
                Sign Up
              </NextLink>
            </p>
          </div>
        </div>

        {/* Tracking Number */}
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-[var(--dashboard-text-on-light)]"
            htmlFor="tracking-number"
          >
            Tracking Number search
          </label>
          <Input
            id="tracking-number"
            aria-label="Tracking Number"
            classNames={{
              inputWrapper:
                "bg-white border border-[var(--dashboard-content-border)]",
            }}
            endContent={
              <SearchIcon className="h-5 w-5 text-[var(--dashboard-text-on-light-muted)]" />
            }
            placeholder="Enter tracking number"
            value={trackingNumber}
            onValueChange={setTrackingNumber}
          />
        </div>

        {/* Role Buttons */}
        <div className="space-y-2">
          <span className="block text-sm font-medium text-[var(--dashboard-text-on-light)]">
            For your other business needs
          </span>
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="border border-[var(--dashboard-content-border)] bg-white font-medium text-orange-600"
              variant="bordered"
            >
              Delivery Driver
            </Button>
            <Button
              className="border border-[var(--dashboard-content-border)] bg-white font-medium text-green-600"
              variant="bordered"
            >
              Customer
            </Button>
            <Button
              className="border border-[var(--dashboard-content-border)] bg-white font-medium text-green-600"
              variant="bordered"
            >
              Logistics Provider
            </Button>
            <Button
              className="border border-[var(--dashboard-content-border)] bg-white font-medium text-[var(--auth-input)]"
              variant="bordered"
            >
              Admins
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
