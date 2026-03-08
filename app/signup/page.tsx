"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { EyeIcon, EyeSlashIcon } from "@/components/icons";

const SUFFIX_OPTIONS = [
  { value: "", label: "None" },
  { value: "Jr", label: "Jr." },
  { value: "Sr", label: "Sr." },
  { value: "II", label: "II" },
  { value: "III", label: "III" },
];

const CITY_OPTIONS = [
  { value: "talibon", label: "Talibon" },
  { value: "bien-unido", label: "Bien Unido" },
  { value: "trinidad", label: "Trinidad" },
];

const BARANGAY_OPTIONS = [
  { value: "balintawak", label: "Balintawak" },
  { value: "san-isidro", label: "San Isidro" },
  { value: "san-pedro", label: "San Pedro" },
];

export default function SignupPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [suffix, setSuffix] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  return (
    <div className="flex min-h-screen flex-col items-center bg-[var(--auth-bg)] px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
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
          <h2 className="text-xl font-bold text-[var(--dashboard-text-on-light)]">
            Create Account
          </h2>
        </div>

        {/* Signup Form */}
        <div className="rounded-xl border border-[var(--dashboard-content-border)] bg-white p-6 shadow-sm">
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <span className="mb-2 block text-sm font-medium text-[var(--dashboard-text-on-light)]">
                Enter Full Name
              </span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <Input
                    aria-label="Family name"
                    classNames={{
                      inputWrapper:
                        "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                    }}
                    label="* Family name"
                    labelPlacement="outside"
                    placeholder="Family name"
                    value={familyName}
                    onValueChange={setFamilyName}
                  />
                </div>
                <div>
                  <Input
                    aria-label="First name"
                    classNames={{
                      inputWrapper:
                        "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                    }}
                    label="* First name"
                    labelPlacement="outside"
                    placeholder="First name"
                    value={firstName}
                    onValueChange={setFirstName}
                  />
                </div>
                <div>
                  <Input
                    aria-label="Middle initial"
                    classNames={{
                      inputWrapper:
                        "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                    }}
                    label="M.I."
                    labelPlacement="outside"
                    placeholder="M.I."
                    value={middleInitial}
                    onValueChange={setMiddleInitial}
                  />
                </div>
                <div>
                  <Select
                    aria-label="Suffix"
                    classNames={{
                      trigger:
                        "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0 min-h-12",
                    }}
                    label="Suffix"
                    labelPlacement="outside"
                    placeholder="Select"
                    selectedKeys={suffix ? [suffix] : []}
                    onSelectionChange={(keys) => {
                      const v = Array.from(keys)[0];
                      setSuffix(v ? String(v) : "");
                    }}
                  >
                    {SUFFIX_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <Input
                aria-label="Username"
                classNames={{
                  inputWrapper:
                    "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                }}
                label="* Username"
                labelPlacement="outside"
                placeholder="Enter username"
                value={username}
                onValueChange={setUsername}
              />
              <p className="mt-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
                Username must be at least 6 characters, combination of letter/s
                and number/s
              </p>
            </div>

            {/* Email */}
            <div>
              <Input
                aria-label="Email"
                classNames={{
                  inputWrapper:
                    "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                }}
                label="* Email"
                labelPlacement="outside"
                placeholder="Enter email"
                type="email"
                value={email}
                onValueChange={setEmail}
              />
            </div>

            {/* Password */}
            <div>
              <Input
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
                label="* Password"
                labelPlacement="outside"
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

            {/* City/Town */}
            <div>
              <Select
                aria-label="City/Town"
                classNames={{
                  trigger:
                    "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0 min-h-12",
                }}
                label="* City/Town"
                labelPlacement="outside"
                placeholder="Select city/town"
                selectedKeys={city ? [city] : []}
                onSelectionChange={(keys) => {
                  const v = Array.from(keys)[0];
                  setCity(v ? String(v) : "");
                }}
              >
                {CITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value}>{opt.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Barangay */}
            <div>
              <Select
                aria-label="Barangay"
                classNames={{
                  trigger:
                    "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0 min-h-12",
                }}
                label="* Barangay"
                labelPlacement="outside"
                placeholder="Select barangay"
                selectedKeys={barangay ? [barangay] : []}
                onSelectionChange={(keys) => {
                  const v = Array.from(keys)[0];
                  setBarangay(v ? String(v) : "");
                }}
              >
                {BARANGAY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value}>{opt.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Mobile Number */}
            <div>
              <Input
                aria-label="Mobile Number"
                classNames={{
                  input: "pl-14",
                  inputWrapper:
                    "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                }}
                label="* Mobile Number"
                labelPlacement="outside"
                placeholder="9XX 123 4567"
                startContent={
                  <span className="text-[var(--auth-input-text)]">+63</span>
                }
                value={mobileNumber}
                onValueChange={setMobileNumber}
              />
              <p className="mt-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
                Please write your 10-digit number (excluding 0, example: 9XX
                123 4567)
              </p>
            </div>

            {/* Consent */}
            <p className="text-xs text-[var(--dashboard-text-on-light)]">
              By clicking sign up, I am giving my consent to process my personal
              information, in compliance with Republic Act No. 10173, otherwise
              known as Philippines Data Privacy Act of 2012.
            </p>

            {/* Sign Up Button */}
            <Button
              className="w-full bg-[var(--auth-input)] text-white"
              size="lg"
              variant="flat"
            >
              Sign Up
            </Button>

            <p className="text-center text-sm text-[var(--dashboard-text-on-light)]">
              Already have an account?{" "}
              <NextLink
                className="font-medium text-[var(--auth-input)] underline"
                href="/login"
              >
                Sign In
              </NextLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
