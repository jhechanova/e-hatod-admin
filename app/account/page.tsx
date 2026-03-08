"use client";

import { useState } from "react";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { EyeIcon, EyeSlashIcon } from "@/components/icons";

export default function AccountPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState("$#ED2748");

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4">
        <Avatar
          className="h-24 w-24 bg-[var(--dashboard-content-border)]"
          name="Faith D. Corpus"
        />
        <h2 className="text-xl font-bold text-[var(--dashboard-text-on-light)]">
          Faith D. Corpus
        </h2>
      </div>

      {/* User Details Form */}
      <div className="space-y-6">
        {/* Full Name - 3 fields */}
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--dashboard-text-on-light)]">
            Full Name
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Input
                aria-label="Family Name"
                classNames={{
                  inputWrapper:
                    "bg-white border border-[var(--dashboard-content-border)]",
                }}
                defaultValue="Corpus"
              />
              <p className="mt-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
                Family Name
              </p>
            </div>
            <div>
              <Input
                aria-label="First Name"
                classNames={{
                  inputWrapper:
                    "bg-white border border-[var(--dashboard-content-border)]",
                }}
                defaultValue="Faith"
              />
              <p className="mt-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
                First Name
              </p>
            </div>
            <div>
              <Input
                aria-label="Middle Initial"
                classNames={{
                  inputWrapper:
                    "bg-white border border-[var(--dashboard-content-border)]",
                }}
                defaultValue="D."
              />
              <p className="mt-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
                M.I.
              </p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <Input
            aria-label="Address"
            classNames={{
              inputWrapper:
                "bg-white border border-[var(--dashboard-content-border)]",
              label: "text-[var(--dashboard-text-on-light)]",
            }}
            defaultValue="Nueva Esperanza, Bien Unido"
            label="Address"
            labelPlacement="outside"
          />
        </div>

        {/* Mobile Phone Number */}
        <div>
          <Input
            aria-label="Mobile Phone Number"
            classNames={{
              inputWrapper:
                "bg-white border border-[var(--dashboard-content-border)]",
              label: "text-[var(--dashboard-text-on-light)]",
            }}
            defaultValue="+63 901 234 5667"
            label="Mobile Phone Number"
            labelPlacement="outside"
          />
        </div>

        {/* Email */}
        <div>
          <Input
            aria-label="Email"
            classNames={{
              inputWrapper:
                "bg-white border border-[var(--dashboard-content-border)]",
              label: "text-[var(--dashboard-text-on-light)]",
            }}
            defaultValue="corpusfaith@gmail.com"
            label="Email"
            labelPlacement="outside"
          />
        </div>

        {/* Username */}
        <div>
          <Input
            aria-label="Username"
            classNames={{
              inputWrapper:
                "bg-white border border-[var(--dashboard-content-border)]",
              label: "text-[var(--dashboard-text-on-light)]",
            }}
            defaultValue="admin2"
            label="Username"
            labelPlacement="outside"
          />
        </div>

        {/* Password */}
        <div>
          <Input
            aria-label="Password"
            classNames={{
              inputWrapper:
                "bg-white border border-[var(--dashboard-content-border)]",
              label: "text-[var(--dashboard-text-on-light)]",
            }}
            endContent={
              <button
                aria-label="Toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <EyeSlashIcon className="h-5 w-5 text-[var(--dashboard-text-on-light-muted)]" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-[var(--dashboard-text-on-light-muted)]" />
                )}
              </button>
            }
            label="Password"
            labelPlacement="outside"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onValueChange={setPassword}
          />
        </div>

        {/* Mid-section Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            className="w-full bg-[var(--dashboard-button)] text-white"
            variant="flat"
          >
            Business Partners-Contracts
          </Button>
          <Button
            className="w-full bg-[var(--dashboard-button)] text-white"
            variant="flat"
          >
            e-Bulletin
          </Button>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button
            className="flex-1 rounded-lg bg-[var(--dashboard-button)] text-white"
            variant="flat"
          >
            Update
          </Button>
          <Button
            className="flex-1 rounded-lg bg-[var(--dashboard-button)] text-white"
            variant="flat"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
