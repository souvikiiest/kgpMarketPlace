"use client";

import { useEffect, useState } from "react";
import ItemList from "../components/ItemList";
import SearchBar from "../components/SearchBar";
import { Listing } from "../types";
import { useDebounce } from "../utils/searchDebounce";

const HomePage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 300);

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/all-items", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data: Listing[] = await response.json();
        setListings(data);
      } else {
        console.error("Error fetching all items");
      }
    } catch (error) {
      console.error("Error fetching all items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/listings/search?q=${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data: Listing[] = await response.json();
        setListings(data);
      } else {
        console.error("Error fetching listings");
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      fetchListings(debouncedQuery);
    } else {
      fetchAllItems();
    }
  }, [debouncedQuery]);

  return (
    <div className="container mx-auto p-4">
      <SearchBar onSearch={setQuery} />
      {loading ? <p>Loading...</p> : <ItemList items={listings} />}
    </div>
  );
};

export default HomePage;
