"use client"

import React, { useState } from "react";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");

  const getContacts = async () => {
    try {
      // Check if the browser supports the Contacts API
      if ("contacts" in navigator && "select" in navigator.contacts) {
        // Request contacts with fields (name, phone number)
        const selectedContacts = await navigator.contacts.select(["name", "tel"], { multiple: true });
        setContacts(selectedContacts);
      } else {
        setError("Your browser does not support the Contacts API.");
      }
    } catch (err) {
      setError("Permission denied or an error occurred.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Access Mobile Contacts</h1>
      <button onClick={getContacts}>Get Contacts</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {contacts.map((contact, index) => (
          <li key={index}>
            <strong>{contact.name}</strong>: {contact.tel.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
