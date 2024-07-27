"use client";

export default function HandleLogout() {
  const handleLogout = async () => {
    const responce = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (responce.ok) {
      window.location.href = "/home";
    }
  };
  return (
    <form onSubmit={handleLogout}>
      <button
        type="submit"
        className="text-white bg-red-500 px-4 py-2 rounded-md"
      >
        Logout
      </button>
    </form>
  );
}
