"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { EyeIcon, EyeSlashIcon, SearchIcon } from "@/components/icons";
import { signIn, getResponseStatus, getResponseMessage } from "@/lib/api/auth";
import { setAuthCookie } from "@/lib/auth";
import { setStoredUser } from "@/lib/user";

function FieldLabel({
  children,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      className="mb-1.5 block text-sm font-semibold text-gray-900 antialiased"
      htmlFor={htmlFor}
      style={{ WebkitFontSmoothing: "antialiased" }}
    >
      {required && (
        <span className="mr-0.5 text-red-600" aria-hidden>
          *
        </span>
      )}
      {children}
    </label>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!username.trim()) errors.username = "Username is required.";
    else if (username.length < 6 || !/^[a-zA-Z0-9]+$/.test(username))
      errors.username = "Username must be at least 6 characters, letters and numbers only.";
    if (!password.trim()) errors.password = "Password is required.";
    else if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password))
      errors.password = "Password must be at least 8 characters with letters, numbers, and special characters.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setFieldErrors({});
    try {
      const response = await signIn({ username: username.trim(), password });
      const statusCode = getResponseStatus(response);
      if (statusCode === 200) {
        setAuthCookie();
        setStoredUser(response.jsonBody);
        router.push("/dashboard");
      } else {
        const msg =
          getResponseMessage(response) ??
          response.error ??
          "Login failed. Please check your credentials.";
        setFieldErrors((prev) => ({ ...prev, _form: msg }));
      }
    } catch (err) {
      setFieldErrors((prev) => ({
        ...prev,
        _form: err instanceof Error ? err.message : "Login failed. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--auth-bg)] px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center gap-4">
          {/* <Avatar
            className="h-24 w-24 bg-[var(--auth-input)]"
            icon={<span className="text-4xl">🚗</span>}
            name="BOHOL e-Hatod"
          /> */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--dashboard-text-on-light)]">
              BOHOL e-Hatod
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-[var(--dashboard-text-on-light)]">
            Welcome
          </h2>
        </div>

        {/* Login Form */}
        <div
          className="form-fields-visible rounded-xl border border-[var(--dashboard-content-border)] bg-white p-6 shadow-sm"
          style={{
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          <div className="space-y-4">
            <div>
              <FieldLabel required htmlFor="login-username">
                Username
              </FieldLabel>
              <Input
                id="login-username"
                aria-label="Username"
                aria-invalid={!!fieldErrors.username}
                classNames={{
                  input: "!text-black placeholder:!text-gray-500",
                  inputWrapper: "!bg-white !text-black border border-[var(--form-field-border)]",
                }}
                errorMessage={fieldErrors.username}
                isInvalid={!!fieldErrors.username}
                placeholder="Enter username"
                value={username}
                onValueChange={(v) => {
                  setUsername(v);
                  setFieldErrors((e) => {
                    const next = { ...e };
                    delete next.username;
                    if (e._form) delete next._form;
                    return next;
                  });
                }}
              />
              <p className="mt-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
                Username must be at least 6 characters, combination of letter/s
                and number/s
              </p>
            </div>

            <div>
              <FieldLabel required htmlFor="login-password">
                Password
              </FieldLabel>
              <Input
                id="login-password"
                aria-label="Password"
                aria-invalid={!!fieldErrors.password}
                classNames={{
                  input: "!text-black placeholder:!text-gray-500",
                  inputWrapper: "!bg-white !text-black border border-[var(--form-field-border)]",
                }}
                endContent={
                  <button
                    aria-label="Toggle password visibility"
                    className="text-black focus:outline-none"
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
                errorMessage={fieldErrors.password}
                isInvalid={!!fieldErrors.password}
                placeholder="Enter password"
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onValueChange={(v) => {
                  setPassword(v);
                  setFieldErrors((e) => {
                    const next = { ...e };
                    delete next.password;
                    if (e._form) delete next._form;
                    return next;
                  });
                }}
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

            {fieldErrors._form && (
              <p className="text-sm font-medium text-red-600" role="alert">
                {fieldErrors._form}
              </p>
            )}
            <Button
              className="w-full bg-[var(--auth-input)] text-white"
              isLoading={isLoading}
              size="lg"
              variant="flat"
              onPress={handleSignIn}
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
        <div className="form-fields-visible space-y-2">
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
              input: "!text-black placeholder:!text-gray-500",
              inputWrapper: "!bg-white !text-black border border-[var(--form-field-border)]",
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
