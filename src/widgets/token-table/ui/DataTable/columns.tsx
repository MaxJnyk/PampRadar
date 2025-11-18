"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LaunchToken } from "../../../../entities/token/api/tokenApi";
import { TokenCell, CACell, VolumeCell, MarketCapCell, ProgressCell, HoldersCell, TradeCell } from "../cells";

export const columns: ColumnDef<LaunchToken>[] = [
  {
    id: "token",
    header: "TOKEN",
    cell: ({ row }) => <TokenCell token={row.original} />,
    size: 300,
  },
  {
    id: "ca",
    header: "CA",
    cell: ({ row }) => <CACell token={row.original} />,
    size: 165,
  },
  {
    accessorKey: "volume24h",
    header: "VOLUME",
    cell: ({ row }) => <VolumeCell token={row.original} />,
    size: 135,
  },
  {
    accessorKey: "marketCap",
    header: "MARKET CAP",
    cell: ({ row }) => <MarketCapCell token={row.original} />,
    size: 140,
  },
  {
    id: "progress",
    header: "PROGRESS",
    cell: ({ row }) => <ProgressCell token={row.original} />,
    size: 120,
  },
  {
    accessorKey: "holders",
    header: "HOLDERS",
    cell: ({ row }) => <HoldersCell token={row.original} />,
    size: 160,
  },
  {
    id: "trade",
    header: "TRADE",
    cell: ({ row }) => <TradeCell token={row.original} />,
    size: 140,
  },
];
