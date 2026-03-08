"use client";

import { useState } from "react";
import clsx from "clsx";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  CameraIcon,
  ImageIcon,
  PaperclipIcon,
  SendIcon,
} from "@/components/icons";

const PARTICIPANTS = [
  { id: "1", name: "Mark Andre", status: "Active Now", isOnline: true },
  { id: "2", name: "Mark Andre", status: "Message here", isOnline: true },
  { id: "3", name: "Mark Andre", status: "Message here", isOnline: false },
  { id: "4", name: "Mark Andre", status: "Message here", isOnline: true },
  { id: "5", name: "Mark Andre", status: "Message here", isOnline: false },
  { id: "6", name: "Mark Andre", status: "Message here", isOnline: true },
  { id: "7", name: "Mark Andre", status: "Message here", isOnline: false },
  { id: "8", name: "Mark Andre", status: "Message here", isOnline: true },
];

const MESSAGES = [
  { id: "1", from: "contact", text: "Chat messages here.", time: null },
  { id: "2", from: "user", text: "Chat messages here.", time: "04 June 2025, 1400" },
  { id: "3", from: "contact", text: "Chat messages here.", time: null },
  { id: "4", from: "user", text: "Chat messages here.", time: null },
];

export default function ChatRoom1Page() {
  const [message, setMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(PARTICIPANTS[0]);

  return (
    <ChatRoomScreen
      participants={PARTICIPANTS}
      messages={MESSAGES}
      selectedContact={selectedContact}
      onSelectContact={setSelectedContact}
      message={message}
      onMessageChange={setMessage}
    />
  );
}

function ChatRoomScreen({
  participants,
  messages,
  selectedContact,
  onSelectContact,
  message,
  onMessageChange,
}: {
  participants: typeof PARTICIPANTS;
  messages: { id: string; from: string; text: string; time: string | null }[];
  selectedContact: (typeof PARTICIPANTS)[0];
  onSelectContact: (c: (typeof PARTICIPANTS)[0]) => void;
  message: string;
  onMessageChange: (v: string) => void;
}) {
  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      <div className="flex flex-1 min-h-0 gap-4 rounded-lg border border-[var(--dashboard-content-border)] bg-white p-4">
        {/* Participants List */}
        <div className="flex w-64 shrink-0 flex-col gap-2 overflow-y-auto">
          {participants.map((p) => (
            <button
              key={p.id}
              className={clsx(
                "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                "border-[var(--dashboard-content-border)] bg-white",
                "hover:bg-[var(--dashboard-content)]/50",
                selectedContact.id === p.id && "border-[var(--dashboard-button)] bg-[var(--dashboard-content)]/30"
              )}
              type="button"
              onClick={() => onSelectContact(p)}
            >
              <div className="relative shrink-0">
                <Avatar
                  className="h-10 w-10 border-2 border-[var(--dashboard-content-border)]"
                  name={p.name}
                />
                {p.isOnline && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--dashboard-text-on-light)]">
                  {p.name}
                </p>
                <p className="truncate text-xs text-[var(--dashboard-text-on-light-muted)]">
                  {p.status}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Chat Header */}
          <div className="mb-4 flex items-center gap-3 border-b border-[var(--dashboard-content-border)] pb-4">
            <div className="relative shrink-0">
              <Avatar
                className="h-12 w-12 border-2 border-[var(--dashboard-content-border)]"
                name={selectedContact.name}
              />
              {selectedContact.isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              )}
            </div>
            <div>
              <p className="font-semibold text-[var(--dashboard-text-on-light)]">
                {selectedContact.name}
              </p>
              <p className="text-sm text-green-600">{selectedContact.status}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={clsx(
                  "flex",
                  m.from === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={clsx(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    m.from === "user"
                      ? "bg-[var(--dashboard-content)]/80"
                      : "bg-white border border-[var(--dashboard-content-border)]"
                  )}
                >
                  {m.time && (
                    <p className="mb-1 text-xs text-[var(--dashboard-text-on-light-muted)]">
                      {m.time}
                    </p>
                  )}
                  <p className="text-sm text-[var(--dashboard-text-on-light)]">
                    {m.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                className="bg-transparent text-[var(--dashboard-text-on-light-muted)]"
                size="sm"
                variant="light"
              >
                <PaperclipIcon className="h-5 w-5" />
              </Button>
              <Button
                isIconOnly
                className="bg-transparent text-[var(--dashboard-text-on-light-muted)]"
                size="sm"
                variant="light"
              >
                <CameraIcon className="h-5 w-5" />
              </Button>
              <Button
                isIconOnly
                className="bg-transparent text-[var(--dashboard-text-on-light-muted)]"
                size="sm"
                variant="light"
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Input
                classNames={{
                  inputWrapper:
                    "bg-white border border-[var(--dashboard-content-border)] flex-1",
                }}
                placeholder="Type your message here"
                value={message}
                onValueChange={onMessageChange}
              />
              <Button
                isIconOnly
                className="bg-[var(--dashboard-button)] text-white"
                size="md"
              >
                <SendIcon className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-center text-xs text-[var(--dashboard-text-on-light-muted)]">
              &quot;All conversations will be automatically deleted after 31
              days&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
