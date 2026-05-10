"use client";
import { JSX } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { StatsCardContainer, StatsCard } from "@/src/components/UI/StatsCard";
import { HiOutlineUsers } from "react-icons/hi";

export default function DashboardPage(): JSX.Element {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <>
      {" "}
      <StatsCardContainer>
        <StatsCard
          label="Total Contacts"
          value={2000}
          icon={<HiOutlineUsers className="w-5 h-5" />}
          isLoading={false}
        />
        <StatsCard
          label="Total Contacts"
          value={2000}
          icon={<HiOutlineUsers className="w-5 h-5" />}
          isLoading={false}
        />
      </StatsCardContainer>
      <div>
        <p>
          hello {user?.firstName} {user?.lastName}
        </p>
      </div>
    </>
  );
}
