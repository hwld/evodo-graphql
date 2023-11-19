"use client";

import { Routes } from "@/lib/routes";
import { redirect } from "next/navigation";

const HomePage: React.FC = () => {
  redirect(Routes.home);
};

export default HomePage;
