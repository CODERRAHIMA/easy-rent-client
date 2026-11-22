
const API_BASE_URL = "http://localhost:5000";

type CreateBookingPayload = {
  equipmentId: string;
  userId: string;
  userEmail: string;
  quantity: number;
  startDate: string;
  endDate: string;
  contactNumber: string;
  deliveryAddress: string;
  additionalNotes: string;
};

export async function createBooking(payload: CreateBookingPayload) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/bookings/create-check-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to create booking",
      };
    }

    return data;
  } catch (err) {
    console.error("createBooking failed:", err);

    return {
      success: false,
      message: "Something went wrong while creating the booking",
    };
  }
}
