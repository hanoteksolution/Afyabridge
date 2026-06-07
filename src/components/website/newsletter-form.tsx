"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await subscribeNewsletter(email);
    setLoading(false);
    if (result.success) {
      toast.success("Subscribed successfully!");
      setEmail("");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-white/10 border-white/20 text-white placeholder:text-blue-300"
      />
      <Button
        type="submit"
        disabled={loading}
        className="shrink-0 bg-[#00C2FF] text-[#0A1F78] hover:bg-[#00C2FF]/90"
      >
        Join
      </Button>
    </form>
  );
}
