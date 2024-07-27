"use client";

import { useState } from "react";
import { generateEmailBody } from "../utils/emailBody";

interface Propstype {
  isLoggedIn: boolean;
  buyerData: {
    phoneNo: string;
    email: string;
    username: string;
  };
  sellerData: {
    phoneNo: string;
    email: string;
    title: string;
  };
}

export default function EmailButtonComponent({
  isLoggedIn,
  buyerData,
  sellerData,
}: Propstype) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showContactPrompt, setShowContactPrompt] = useState(false);
  const [showContactInputs, setShowContactInputs] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [showSellerDetails, setShowSellerDetails] = useState(false);

  function handleClick() {
    setShowSellerDetails(false);
    if (isLoggedIn) {
      setShowContactPrompt(true);
    } else {
      setShowContactInputs(true);
    }
  }

  const handleShareContact = async (contactDetails: boolean) => {
    setLoading(true);
    setShowContactPrompt(false);
    setShowContactInputs(false);

    const body = {
      sellerEmail: sellerData.email,
      productName: sellerData.title,
    };
    const emailBody = generateEmailBody(
      sellerData.title,
      contactDetails ? (isLoggedIn ? buyerData.email : buyerEmail) : undefined,
      contactDetails ? (isLoggedIn ? buyerData.phoneNo : buyerPhone) : undefined
    );

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...body, emailBody }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Email sent successfully");
      } else {
        setMessage("Failed to send email");
      }
    } catch (error) {
      setMessage("An error occurred");
    }
    setLoading(false);
    setShowSellerDetails(true);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
        disabled={loading}
      >
        {loading ? "Sending..." : "Contact Seller"}
      </button>

      {showContactPrompt && (
        <div className="mt-4">
          <p>Do you want to share your contact details with the seller?</p>
          <button
            onClick={() => handleShareContact(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
          >
            Yes
          </button>
          <button
            onClick={() => handleShareContact(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md mt-2 ml-2"
          >
            No
          </button>
        </div>
      )}

      {showContactInputs && (
        <div className="mt-4">
          <p>
            Since you are not logged in, do you want to share your email and
            phone with the seller?
          </p>
          <input
            type="email"
            placeholder="Your Email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={() => handleShareContact(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Share and Send Email
          </button>
          <button
            onClick={() => handleShareContact(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md mt-2 ml-2"
          >
            Do Not Share, Just Notify
          </button>
        </div>
      )}

      {message && <p className="mt-4">{message}</p>}

      {showSellerDetails && (
        <div className="mt-4">
          <p>
            <strong>Seller Contact Details:</strong>
          </p>
          <p>Email: {sellerData.email}</p>
          <p>Phone: {sellerData.phoneNo}</p>
        </div>
      )}
    </div>
  );
}
