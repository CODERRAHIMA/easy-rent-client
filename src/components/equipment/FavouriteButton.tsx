"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";


const API_URL = "http://localhost:5000";

export default function FavouriteButton({
  equipmentId,
}: {
  equipmentId: string;
}) {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check existing favourite status
  useEffect(() => {
    if (!email || !equipmentId) return;

    const checkFavourite = async () => {
      try {
        const token = await getTokenFromClient();
        const response = await fetch(
          `${API_URL}/favourites/status/${equipmentId}?email=${encodeURIComponent(email)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();

        if (response.ok) {
          setIsFavourite(result.isFavourite);
        }
      } catch (error) {
        console.error("Failed to check favourite:", error);
      }
    };

    checkFavourite();
  }, [email, equipmentId]);

  // Toggle favourite
  const handleFavourite = async () => {
    if (!email) {
      alert("Please login to add favourites");
      return;
    }

    try {
      setLoading(true);
      const token = await getTokenFromClient();

      if (isFavourite) {
        const response = await fetch(
          `${API_URL}/favourites/${equipmentId}?email=${encodeURIComponent(email)}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }

        setIsFavourite(false);
      } else {
        const response = await fetch(`${API_URL}/favourites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            equipmentId,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }

        setIsFavourite(true);
      }
    } catch (error) {
      console.error("Favourite update error:", error);
      alert("Could not update favourite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleFavourite}
      disabled={loading || !email}
      aria-label={
        isFavourite ? "Remove from favourites" : "Add to favourites"
      }
      title={
        isFavourite ? "Remove from favourites" : "Add to favourites"
      }
      className="absolute bottom-3 right-3 cursor-pointer flex size-10 items-center justify-center rounded-full bg-white/95 text-[#1B1F16] shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Heart
        className={`size-5 transition ${
          isFavourite ? "fill-red-500 text-red-500" : ""
        }`}
      />
    </button>
  );
}
