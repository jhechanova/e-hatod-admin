"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { EyeIcon, EyeSlashIcon } from "@/components/icons";
import {
  updateUser,
  getResponseStatus,
  getResponseMessage,
} from "@/lib/api/auth";
import { getStoredUser, setStoredUser, type User } from "@/lib/user";
import {
  getMunicipalities,
  getBarangaysByMunicipality,
  type Municipality,
  type Barangay,
} from "@/lib/api/tools";

const INPUT_STYLES = {
  input: "!text-black placeholder:!text-gray-500",
  inputWrapper: "!bg-white !text-black border-2 border-[var(--form-field-border)]",
};
const SELECT_TRIGGER_STYLES =
  "!bg-white !text-black border-2 border-[var(--form-field-border)] min-h-12 [&_[data-slot=value]]:!text-black [&_[data-slot=placeholder]]:!text-gray-500";

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

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [suffix, setSuffix] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [municipalityId, setMunicipalityId] = useState<string>("");
  const [barangayId, setBarangayId] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const u = getStoredUser();
    if (!u) {
      // No user data (e.g. logged in before user storage was added).
      // Redirect to logout to clear session, then user can re-login.
      router.replace("/logout");
      return;
    }
    setUser(u);
    setFamilyName(u.lastName);
    setFirstName(u.firstName);
    setMiddleInitial(u.middleInitial ?? "");
    setSuffix(u.suffixName ?? "");
    setUsername(u.username);
    setEmail(u.email ?? "");
    setAddress(u.address ?? "");
    setMunicipalityId(String(u.municipalityId));
    setBarangayId(String(u.barangayId));
    setMobileNumber(u.phoneNumber);
  }, [router]);

  useEffect(() => {
    getMunicipalities().then(setMunicipalities).catch(() => setMunicipalities([]));
  }, []);

  useEffect(() => {
    if (!municipalityId) {
      setBarangays([]);
      return;
    }
    getBarangaysByMunicipality(municipalityId)
      .then(setBarangays)
      .catch(() => setBarangays([]));
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
    if (password) {
      if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password))
        errors.password = "Password must be at least 8 characters with letters, numbers, and special characters.";
      else if (password !== confirmPassword)
        errors.confirmPassword = "Passwords do not match.";
    }
    if (confirmPassword && !password)
      errors.confirmPassword = "Enter new password first.";
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

  const handleUpdate = async () => {
    if (!user || !validateForm()) return;
    setIsLoading(true);
    setFieldErrors({});
    try {
      const response = await updateUser({
        userId: user.id,
        username: username.trim(),
        password: password || undefined,
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
        setStoredUser({
          ...user,
          username: username.trim(),
          firstName: firstName.trim(),
          lastName: familyName.trim(),
          email: email.trim(),
          phoneNumber: mobileNumber.replace(/\D/g, "").slice(-10) || mobileNumber.trim(),
          address: address.trim(),
          municipalityId: Number(municipalityId),
          barangayId: Number(barangayId),
          suffixName: suffix || undefined,
          middleInitial: middleInitial.trim() || undefined,
        });
        setPassword("");
        setConfirmPassword("");
        setFieldErrors({});
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          _form:
            getResponseMessage(response) ??
            response.error ??
            "Update failed. Please try again.",
        }));
      }
    } catch (err) {
      setFieldErrors((prev) => ({
        ...prev,
        _form: err instanceof Error ? err.message : "Update failed. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFamilyName(user.lastName);
      setFirstName(user.firstName);
      setMiddleInitial(user.middleInitial ?? "");
      setSuffix(user.suffixName ?? "");
      setUsername(user.username);
      setEmail(user.email ?? "");
      setPassword("");
      setConfirmPassword("");
      setAddress(user.address ?? "");
      setMunicipalityId(String(user.municipalityId));
      setBarangayId(String(user.barangayId));
      setMobileNumber(user.phoneNumber);
      setFieldErrors({});
    }
  };

  if (!user) return null;

  const displayName = [firstName, middleInitial, familyName].filter(Boolean).join(" ") || user.username;

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4">
        <Avatar
          className="h-24 w-24 bg-[var(--dashboard-content-border)]"
          name={displayName}
        />
        <h2 className="text-xl font-bold text-[var(--dashboard-text-on-light)]">
          {displayName}
        </h2>
      </div>

      {/* User Details Form */}
      <div
        className="form-fields-visible space-y-6"
        style={{
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {/* Full Name */}
        <div>
          <span className="mb-2 block text-sm font-semibold text-gray-900 antialiased">
            Full Name
          </span>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <FieldLabel required htmlFor="account-family-name">
                Family name
              </FieldLabel>
              <Input
                id="account-family-name"
                aria-invalid={!!fieldErrors.familyName}
                classNames={INPUT_STYLES}
                errorMessage={fieldErrors.familyName}
                isInvalid={!!fieldErrors.familyName}
                placeholder="Family name"
                value={familyName}
                onValueChange={(v) => {
                  setFamilyName(v);
                  setFieldErrors((e) => ({ ...e, familyName: "" }));
                }}
              />
            </div>
            <div>
              <FieldLabel required htmlFor="account-first-name">
                First name
              </FieldLabel>
              <Input
                id="account-first-name"
                aria-invalid={!!fieldErrors.firstName}
                classNames={INPUT_STYLES}
                errorMessage={fieldErrors.firstName}
                isInvalid={!!fieldErrors.firstName}
                placeholder="First name"
                value={firstName}
                onValueChange={(v) => {
                  setFirstName(v);
                  setFieldErrors((e) => ({ ...e, firstName: "" }));
                }}
              />
            </div>
            <div>
              <FieldLabel htmlFor="account-middle-initial">
                M.I.
              </FieldLabel>
              <Input
                id="account-middle-initial"
                classNames={INPUT_STYLES}
                placeholder="M.I."
                value={middleInitial}
                onValueChange={setMiddleInitial}
              />
            </div>
            <div>
              <FieldLabel htmlFor="account-suffix">
                Suffix
              </FieldLabel>
              <Select
                id="account-suffix"
                classNames={{ trigger: SELECT_TRIGGER_STYLES }}
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
          <FieldLabel required htmlFor="account-username">
            Username
          </FieldLabel>
          <Input
            id="account-username"
            aria-invalid={!!fieldErrors.username}
            classNames={INPUT_STYLES}
            errorMessage={fieldErrors.username}
            isInvalid={!!fieldErrors.username}
            placeholder="Enter username"
            value={username}
            onValueChange={(v) => {
              setUsername(v);
              setFieldErrors((e) => ({ ...e, username: "" }));
            }}
          />
          <p className="mt-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
            Username must be at least 6 characters, letters and numbers only.
          </p>
        </div>

        {/* Email */}
        <div>
          <FieldLabel required htmlFor="account-email">
            Email
          </FieldLabel>
          <Input
            id="account-email"
            aria-invalid={!!fieldErrors.email}
            classNames={INPUT_STYLES}
            errorMessage={fieldErrors.email}
            isInvalid={!!fieldErrors.email}
            placeholder="Enter email"
            type="email"
            value={email}
            onValueChange={(v) => {
              setEmail(v);
              setFieldErrors((e) => ({ ...e, email: "" }));
            }}
          />
        </div>

        {/* Password (optional - for change) */}
        <div>
          <FieldLabel htmlFor="account-password">
            New Password
          </FieldLabel>
          <Input
            id="account-password"
            aria-invalid={!!fieldErrors.password}
            classNames={INPUT_STYLES}
            endContent={
              <button
                aria-label="Toggle password visibility"
                className="focus:outline-none text-[var(--form-field-text)]"
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
            placeholder="Leave blank to keep current"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onValueChange={(v) => {
              setPassword(v);
              setFieldErrors((e) => ({ ...e, password: "", confirmPassword: "" }));
            }}
          />
          <p className="mt-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
            Leave blank to keep current. Must be 8+ chars with letters, numbers, and special characters.
          </p>
        </div>

        {/* Confirm Password */}
        {password && (
          <div>
            <FieldLabel required htmlFor="account-confirm-password">
              Confirm New Password
            </FieldLabel>
            <Input
              id="account-confirm-password"
              aria-invalid={!!fieldErrors.confirmPassword}
              classNames={INPUT_STYLES}
              endContent={
                <button
                  aria-label="Toggle password visibility"
                  className="focus:outline-none text-[var(--form-field-text)]"
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
              placeholder="Confirm new password"
              type={isPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onValueChange={(v) => {
                setConfirmPassword(v);
                setFieldErrors((e) => ({ ...e, confirmPassword: "" }));
              }}
            />
          </div>
        )}

        {/* Address */}
        <div>
          <FieldLabel required htmlFor="account-address">
            Street Address
          </FieldLabel>
          <Input
            id="account-address"
            aria-invalid={!!fieldErrors.address}
            classNames={INPUT_STYLES}
            errorMessage={fieldErrors.address}
            isInvalid={!!fieldErrors.address}
            placeholder="Enter street address"
            value={address}
            onValueChange={(v) => {
              setAddress(v);
              setFieldErrors((e) => ({ ...e, address: "" }));
            }}
          />
        </div>

        {/* City/Town */}
        <div>
          <FieldLabel required htmlFor="account-city">
            City/Town
          </FieldLabel>
          <Select
            id="account-city"
            aria-invalid={!!fieldErrors.municipalityId}
            classNames={{ trigger: SELECT_TRIGGER_STYLES }}
            placeholder="Select city/town"
            selectedKeys={municipalityId ? [municipalityId] : []}
            onSelectionChange={(keys) => {
              const v = Array.from(keys)[0];
              setMunicipalityId(v ? String(v) : "");
              setBarangayId("");
              setFieldErrors((e) => ({ ...e, municipalityId: "", barangayId: "" }));
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
          <FieldLabel required htmlFor="account-barangay">
            Barangay
          </FieldLabel>
          <Select
            id="account-barangay"
            aria-invalid={!!fieldErrors.barangayId}
            classNames={{ trigger: SELECT_TRIGGER_STYLES }}
            isDisabled={!municipalityId}
            placeholder="Select barangay"
            selectedKeys={barangayId ? [barangayId] : []}
            onSelectionChange={(keys) => {
              const v = Array.from(keys)[0];
              setBarangayId(v ? String(v) : "");
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

        {/* Mobile Number */}
        <div>
          <FieldLabel required htmlFor="account-mobile">
            Mobile Number
          </FieldLabel>
          <Input
            id="account-mobile"
            aria-invalid={!!fieldErrors.mobileNumber}
            classNames={{
              input: "pl-14 !text-black placeholder:!text-gray-500",
              inputWrapper:
                "!bg-white !text-black border-2 border-[var(--form-field-border)]",
            }}
            errorMessage={fieldErrors.mobileNumber}
            isInvalid={!!fieldErrors.mobileNumber}
            placeholder="9XX 123 4567"
            startContent={
              <span className="text-black font-medium">+63</span>
            }
            value={mobileNumber}
            onValueChange={(v) => {
              setMobileNumber(v);
              setFieldErrors((e) => ({ ...e, mobileNumber: "" }));
            }}
          />
          <p className="mt-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
            Enter 10-digit number starting with 9 (e.g. 9XX 123 4567).
          </p>
        </div>

        {fieldErrors._form && (
          <p className="text-sm font-medium text-red-600" role="alert">
            {fieldErrors._form}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button
            className="flex-1 rounded-lg bg-[var(--dashboard-button)] text-white"
            isLoading={isLoading}
            variant="flat"
            onPress={handleUpdate}
          >
            Update
          </Button>
          <Button
            className="flex-1 rounded-lg border-2 border-[var(--form-field-border)] !bg-white !text-black"
            variant="bordered"
            onPress={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
