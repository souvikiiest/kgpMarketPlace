export async function updateListing(id: string, formData: any) {
  try {
    const response = await fetch(`/api/listings/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to update listing");
    }

    return { ok: true };
  } catch (error: any) {
    console.error("Error updating listing:", error);
    return { ok: false, error: error.message };
  }
}
