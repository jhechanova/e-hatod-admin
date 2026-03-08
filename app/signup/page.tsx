"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { EyeIcon, EyeSlashIcon } from "@/components/icons";
import {
  signUp,
  getResponseStatus,
  getResponseMessage,
} from "@/lib/api/auth";
import {
  getMunicipalities,
  getBarangaysByMunicipality,
  type Municipality,
  type Barangay,
} from "@/lib/api/tools";

const SUFFIX_OPTIONS = [
  { value: "", label: "None" },
  { value: "Jr", label: "Jr." },
  { value: "Sr", label: "Sr." },
  { value: "II", label: "II" },
  { value: "III", label: "III" },
];

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

export default function SignupPage() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [suffix, setSuffix] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [municipalityId, setMunicipalityId] = useState<string>("");
  const [barangayId, setBarangayId] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getMunicipalities().then(setMunicipalities).catch(() => setMunicipalities([]));
  }, []);

  useEffect(() => {
    if (!municipalityId) {
      setBarangays([]);
      setBarangayId("");
      return;
    }
    getBarangaysByMunicipality(municipalityId)
      .then(setBarangays)
      .catch(() => setBarangays([]));
    setBarangayId("");
  }, [municipalityId]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!familyName.trim()) errors.familyName = "Family name is required.";
    if (!firstName.trim()) errors.firstName = "First name is required.";
    if (!username.trim()) errors.username = "Username is required.";
    else if (username.length < 6 || !/^[a-zA-Z0-9]+$/.test(username))
      errors.username = "Username must be at least 6 characters, letters and numbers only.";
    if (!email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please enter a valid email address.";
    if (!password.trim()) errors.password = "Password is required.";
    else if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password))
      errors.password = "Password must be at least 8 characters with letters, numbers, and special characters.";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
    if (!address.trim()) errors.address = "Address is required.";
    if (!municipalityId) errors.municipalityId = "City/Town is required.";
    if (!barangayId) errors.barangayId = "Barangay is required.";
    const phone = mobileNumber.replace(/\D/g, "");
    if (!mobileNumber.trim()) errors.mobileNumber = "Mobile number is required.";
    else if (phone.length !== 10 || !phone.startsWith("9"))
      errors.mobileNumber = "Enter a valid 10-digit number starting with 9 (e.g. 9XX 123 4567).";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setFieldErrors({});
    try {
      const response = await signUp({
        username: username.trim(),
        password,
        firstName: firstName.trim(),
        lastName: familyName.trim(),
        phoneNumber: mobileNumber.replace(/\D/g, "").slice(-10) || mobileNumber.trim(),
        municipality: Number(municipalityId),
        barangay: Number(barangayId),
        address: address.trim(),
        email: email.trim(),
        suffixName: suffix || undefined,
        middleInitial: middleInitial.trim() || undefined,
      });
      const statusCode = getResponseStatus(response);
      if (statusCode === 200) {
        router.push("/login");
      } else {
        const msg =
          getResponseMessage(response) ??
          response.error ??
          "Sign up failed. Please try again.";
        setFieldErrors((prev) => ({ ...prev, _form: msg }));
      }
    } catch (err) {
      setFieldErrors((prev) => ({
        ...prev,
        _form: err instanceof Error ? err.message : "Sign up failed. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[var(--auth-bg)] px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center gap-4">
          {/* <Avatar
            className="h-24 w-24 bg-[var(--auth-input)]"
            icon={<span className="text-4xl">🚗</span>}
            name="BOHOL e-Hatod"
          /> */}
          {/* <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--dashboard-text-on-light)]">
              BOHOL e-Hatod
            </h1>
          </div> */}
          <h2 className="text-xl font-bold text-[var(--dashboard-text-on-light)]">
            Create Account
          </h2>
        </div>

        {/* Signup Form */}
        <div
          className="rounded-xl border border-[var(--dashboard-content-border)] bg-white p-6 shadow-sm"
          style={{
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                <div>
                  <FieldLabel required htmlFor="family-name">
                    Family name
                  </FieldLabel>
                  <Input
                    id="family-name"
                    aria-label="Family name"
                    aria-invalid={!!fieldErrors.familyName}
                    classNames={{
                      inputWrapper:
                        "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                    }}
                    errorMessage={fieldErrors.familyName}
                    isInvalid={!!fieldErrors.familyName}
                    placeholder="Family name"
                    value={familyName}
                    onValueChange={(v) => {
                      setFamilyName(v);
                      if (fieldErrors.familyName) setFieldErrors((e) => ({ ...e, familyName: "" }));
                    }}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="middle-initial">
                    M.I.
                  </FieldLabel>
                  <Input
                    id="middle-initial"
                    aria-label="Middle initial"
                    classNames={{
                      inputWrapper:
                        "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                    }}
                    placeholder="M.I."
                    value={middleInitial}
                    onValueChange={setMiddleInitial}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                <div>
                  <FieldLabel required htmlFor="first-name">
                    First name
                  </FieldLabel>
                  <Input
                    id="first-name"
                    aria-label="First name"
                    aria-invalid={!!fieldErrors.firstName}
                    classNames={{
                      inputWrapper:
                        "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                    }}
                    errorMessage={fieldErrors.firstName}
                    isInvalid={!!fieldErrors.firstName}
                    placeholder="First name"
                    value={firstName}
                    onValueChange={(v) => {
                      setFirstName(v);
                      if (fieldErrors.firstName) setFieldErrors((e) => ({ ...e, firstName: "" }));
                    }}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="suffix">
                    Suffix
                  </FieldLabel>
                  <Select
                    id="suffix"
                    aria-label="Suffix"
                    classNames={{
                      trigger:
                        "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0 min-h-12",
                    }}
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

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {/* Username */}
              <div>
                <FieldLabel required htmlFor="username">
                  Username
                </FieldLabel>
                <Input
                  id="username"
                  aria-label="Username"
                  aria-invalid={!!fieldErrors.username}
                  classNames={{
                    inputWrapper:
                      "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                  }}
                  errorMessage={fieldErrors.username}
                  isInvalid={!!fieldErrors.username}
                  placeholder="Enter username"
                  value={username}
                  onValueChange={(v) => {
                    setUsername(v);
                    if (fieldErrors.username) setFieldErrors((e) => ({ ...e, username: "" }));
                  }}
                />
                <p className="mt-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
                  Username must be at least 6 characters, combination of letter/s
                  and number/s
                </p>
              </div>

              {/* Email */}
              <div>
                <FieldLabel required htmlFor="email">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  aria-label="Email"
                  aria-invalid={!!fieldErrors.email}
                  classNames={{
                    inputWrapper:
                      "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                  }}
                  errorMessage={fieldErrors.email}
                  isInvalid={!!fieldErrors.email}
                  placeholder="Enter email"
                  type="email"
                  value={email}
                  onValueChange={(v) => {
                    setEmail(v);
                    if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: "" }));
                  }}
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <FieldLabel required htmlFor="mobile-number">
                Mobile Number
              </FieldLabel>
              <Input
                id="mobile-number"
                aria-label="Mobile Number"
                aria-invalid={!!fieldErrors.mobileNumber}
                classNames={{
                  input: "pl-14",
                  inputWrapper:
                    "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                }}
                errorMessage={fieldErrors.mobileNumber}
                isInvalid={!!fieldErrors.mobileNumber}
                placeholder="9XX 123 4567"
                startContent={
                  <span className="text-[var(--auth-input-text)]">+63</span>
                }
                value={mobileNumber}
                onValueChange={(v) => {
                  setMobileNumber(v);
                  if (fieldErrors.mobileNumber)
                    setFieldErrors((e) => ({ ...e, mobileNumber: "" }));
                }}
              />
              <p className="mt-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
                Please write your 10-digit number (excluding 0, example: 9XX
                123 4567)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {/* Password */}
              <div>
                <FieldLabel required htmlFor="password">
                  Password
                </FieldLabel>
                <Input
                  id="password"
                  aria-label="Password"
                  aria-invalid={!!fieldErrors.password}
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
                  errorMessage={fieldErrors.password}
                  isInvalid={!!fieldErrors.password}
                  placeholder="Enter password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onValueChange={(v) => {
                    setPassword(v);
                    if (fieldErrors.password) setFieldErrors((e) => ({ ...e, password: "" }));
                    if (fieldErrors.confirmPassword && v !== confirmPassword)
                      setFieldErrors((e) => ({ ...e, confirmPassword: "Passwords do not match." }));
                    else if (fieldErrors.confirmPassword && v === confirmPassword)
                      setFieldErrors((e) => ({ ...e, confirmPassword: "" }));
                  }}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <FieldLabel required htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  aria-label="Confirm password"
                  aria-invalid={!!fieldErrors.confirmPassword}
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
                  errorMessage={fieldErrors.confirmPassword}
                  isInvalid={!!fieldErrors.confirmPassword}
                  placeholder="Confirm password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onValueChange={(v) => {
                    setConfirmPassword(v);
                    if (fieldErrors.confirmPassword)
                      setFieldErrors((e) => ({ ...e, confirmPassword: "" }));
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-[var(--dashboard-text-on-light-muted)]">
              Password must be at least 8 characters combination of letter/s,
              number/s, and special character/s.
            </p>

            {/* Address */}
            <div>
              <FieldLabel required htmlFor="address">
                Street Address
              </FieldLabel>
              <Input
                id="address"
                aria-label="Address"
                aria-invalid={!!fieldErrors.address}
                classNames={{
                  inputWrapper:
                    "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0",
                }}
                errorMessage={fieldErrors.address}
                isInvalid={!!fieldErrors.address}
                placeholder="Enter street address"
                value={address}
                onValueChange={(v) => {
                  setAddress(v);
                  if (fieldErrors.address) setFieldErrors((e) => ({ ...e, address: "" }));
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {/* City/Town (Municipality) */}
              <div>
                <FieldLabel required htmlFor="city-town">
                  City/Town
                </FieldLabel>
                <Select
                  id="city-town"
                  aria-label="City/Town"
                  aria-invalid={!!fieldErrors.municipalityId}
                  classNames={{
                    trigger:
                      "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0 min-h-12",
                  }}
                  placeholder="Select city/town"
                  selectedKeys={municipalityId ? [municipalityId] : []}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setMunicipalityId(v ? String(v) : "");
                    if (fieldErrors.municipalityId)
                      setFieldErrors((e) => ({ ...e, municipalityId: "" }));
                  }}
                >
                  {municipalities.map((m) => (
                    <SelectItem key={String(m.id)}>{m.name}</SelectItem>
                  ))}
                </Select>
                {fieldErrors.municipalityId && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.municipalityId}</p>
                )}
              </div>

              {/* Barangay */}
              <div>
                <FieldLabel required htmlFor="barangay">
                  Barangay
                </FieldLabel>
                <Select
                  id="barangay"
                  aria-label="Barangay"
                  aria-invalid={!!fieldErrors.barangayId}
                  classNames={{
                    trigger:
                      "bg-[var(--auth-input)] text-[var(--auth-input-text)] border-0 min-h-12",
                  }}
                  isDisabled={!municipalityId}
                  placeholder="Select barangay"
                  selectedKeys={barangayId ? [barangayId] : []}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0];
                    setBarangayId(v ? String(v) : "");
                    if (fieldErrors.barangayId)
                      setFieldErrors((e) => ({ ...e, barangayId: "" }));
                  }}
                >
                  {barangays.map((b) => (
                    <SelectItem key={String(b.id)}>{b.name}</SelectItem>
                  ))}
                </Select>
                {fieldErrors.barangayId && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.barangayId}</p>
                )}
              </div>
            </div>

            {/* Consent */}
            <p className="text-xs text-[var(--dashboard-text-on-light)]">
              By clicking sign up, I am giving my consent to process my personal
              information, in compliance with Republic Act No. 10173, otherwise
              known as Philippines Data Privacy Act of 2012.
            </p>

            {fieldErrors._form && (
              <p className="text-sm font-medium text-red-600" role="alert">
                {fieldErrors._form}
              </p>
            )}

            {/* Sign Up Button */}
            <Button
              className="w-full bg-[var(--auth-input)] text-white"
              isLoading={isLoading}
              size="lg"
              variant="flat"
              onPress={handleSignUp}
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
