"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LaunchToken } from "../../../../entities/token/api/tokenApi";
import { TokenCell, CACell, VolumeCell, MarketCapCell, ProgressCell, HoldersCell, TradeCell } from "../cells";

export const columns: ColumnDef<LaunchToken>[] = [
  {
    id: "token",
    header: "TOKEN",
    cell: ({ row }) => <TokenCell token={row.original} />,
    size: 320,
    maxSize: 320,
  },
  {
    id: "ca",
    header: "CA",
    cell: ({ row }) => <CACell token={row.original} />,
  },
  {
    accessorKey: "volume24h",
    header: "VOLUME",
    cell: ({ row }) => <VolumeCell token={row.original} />,
  },
  {
    accessorKey: "marketCap",
    header: "MARKET CAP",
    cell: ({ row }) => <MarketCapCell token={row.original} />,
  },
  {
    id: "progress",
    header: "PROGRESS",
    cell: ({ row }) => <ProgressCell token={row.original} />,
  },
  {
    accessorKey: "holders",
    header: "HOLDERS",
    cell: ({ row }) => <HoldersCell token={row.original} />,
  },
  {
    id: "trade",
    header: "TRADE",
    cell: ({ row }) => <TradeCell token={row.original} />,
  },
];
