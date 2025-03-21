import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="bg-red-500">
      <Link href="/about">Go to About</Link>
    </div>
  );
}
