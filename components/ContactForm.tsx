"use client";

import { links } from "@/lib/data";

/** No backend: composes the message in the visitor's own email app. */
export default function ContactForm() {
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = `Portfolio enquiry from ${f.get("name")}`;
    const body = `${f.get("message")}\n\n${f.get("name")}\n${f.get("email")}`;
    window.location.href = `mailto:${links.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="form" onSubmit={submit}>
      <label>
        <span>Name</span>
        <input name="name" required autoComplete="name" placeholder="Your name" />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" required rows={4} placeholder="Role, project or just a hello" />
      </label>
      <button className="btn primary" type="submit">Send message</button>
      <p className="form-note mono">Opens in your email app, ready to send.</p>
    </form>
  );
}
