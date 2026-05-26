"use client";
import React, { useEffect, useState } from "react";


const Catalog = () => {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
         
        );

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setCatalog(data);

      } catch (error) {
        console.error("Fetch error:", error);
     
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="bg-background">
      <div className="container mx-auto px-4 py-2">
        <div className="mb-5">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Solutions Catalog
          </h1>
          <p className="text-muted-foreground text-lg">
            Catalog List for enterprise solutions for supply chain management
          </p>
        </div>

        <hr className="px-2 h-5 mb-4" />

        {/* Loading */}
        {loading && <p className="text-gray-500">Loading catalog...</p>}

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Pass data to child component */}
        {/* {!loading && !error && (
        //   <SolutionsList solutions={catalog} />
        )} */}
      </div>
    </main>
  );
};

export default Catalog;