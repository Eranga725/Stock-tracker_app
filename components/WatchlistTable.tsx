"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice, formatMarketCapValue, formatPERatio } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Import shadcn/ui Button
import { getCompanyProfile, getQuoteData } from "@/lib/actions/finnhub.actions";
import { removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";

type WatchlistTableProps = {
  initialWatchlist: WatchlistItem[];
  userEmail: string;
};

const WatchlistTable = ({ initialWatchlist, userEmail }: WatchlistTableProps) => {
  const [watchlist, setWatchlist] = useState<StockWithTableData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStockDetails = useCallback(async () => {
    setLoading(true);
    const detailedWatchlist = await Promise.all(
      initialWatchlist.map(async (item) => {
        try {
          const [quoteData, companyProfile] = await Promise.all([
            getQuoteData(item.symbol),
            getCompanyProfile(item.symbol),
          ]);

          const currentPrice = quoteData?.c;
          const change = quoteData?.d;
          const changePercent = quoteData?.dp;
          const marketCap = companyProfile?.marketCapitalization;
          // Finnhub doesn't provide P/E directly in quote or profile,
          // so this would typically come from a dedicated metrics endpoint.
          // For now, we'll leave it as undefined or fetch it separately if available.
          const peRatio = undefined; // Placeholder

          return {
            ...item,
            currentPrice,
            change,
            changePercent,
            marketCap,
            peRatio,
            priceFormatted: currentPrice ? formatPrice(currentPrice) : "-",
            changeFormatted:
              change !== undefined && changePercent !== undefined
                ? `${change > 0 ? "+" : ""}${change.toFixed(2)} (${
                    changePercent > 0 ? "+" : ""
                  }${changePercent.toFixed(2)}%)`
                : "-",
            marketCapFormatted: marketCap ? formatMarketCapValue(marketCap) : "-",
            peRatioFormatted: peRatio ? formatPERatio(peRatio) : "-",
          };
        } catch (error) {
          console.error(`Failed to fetch details for ${item.symbol}:`, error);
          return {
            ...item,
            currentPrice: undefined,
            change: undefined,
            changePercent: undefined,
            marketCap: undefined,
            peRatio: undefined,
            priceFormatted: "-",
            changeFormatted: "-",
            marketCapFormatted: "-",
            peRatioFormatted: "-",
          };
        }
      })
    );
    setWatchlist(detailedWatchlist);
    setLoading(false);
  }, [initialWatchlist]);

  useEffect(() => {
    fetchStockDetails();
    // Refresh data periodically
    const interval = setInterval(fetchStockDetails, 30 * 1000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [fetchStockDetails]);

  const handleRemoveFromWatchlist = async (symbolToRemove: string) => {
    try {
      await removeFromWatchlist(userEmail, symbolToRemove);
      setWatchlist((prev) => prev.filter((item) => item.symbol !== symbolToRemove));
      toast.success(`${symbolToRemove} removed from watchlist`);
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
      toast.error(`Failed to remove ${symbolToRemove} from watchlist`);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading watchlist data...</div>;
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Your watchlist is empty.</p>
        <p className="text-gray-500 mt-2">
          Add stocks to your watchlist to see them here.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>Market Cap</TableHead>
          <TableHead>P/E Ratio</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {watchlist.map((item) => (
          <TableRow key={item.symbol}>
            <TableCell className="font-medium">
              <Link href={`/stocks/${item.symbol}`} className="hover:underline">
                {item.company}
              </Link>
            </TableCell>
            <TableCell>{item.symbol}</TableCell>
            <TableCell>{item.priceFormatted}</TableCell>
            <TableCell
              className={
                item.changePercent !== undefined
                  ? item.changePercent > 0
                    ? "text-green-500"
                    : item.changePercent < 0
                    ? "text-red-500"
                    : ""
                  : ""
              }
            >
              {item.changeFormatted}
            </TableCell>
            <TableCell>{item.marketCapFormatted}</TableCell>
            <TableCell>{item.peRatioFormatted}</TableCell>
            <TableCell className="flex justify-center items-center h-full">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveFromWatchlist(item.symbol)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m-1.022.165L5.412 19.673a2.25 2.25 0 002.244 2.077h7.21a2.25 2.25 0 002.244-2.077L19.588 5.79m-9.217 0a48.128 48.128 0 01-.645-.353m-.293-.18C12.394 6.78 15 6.78 15 6.78m-4.793-1.018A48.108 48.108 0 0013.478 5.1c1.282.023 2.56.096 3.82.203m-4.788 0L9.26 9m-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m-1.022.165L5.412 19.673a2.25 2.25 0 002.244 2.077h7.21a2.25 2.25 0 002.244-2.077L19.588 5.79m-9.217 0a48.128 48.128 0 01-.645-.353m-.293-.18C12.394 6.78 15 6.78 15 6.78m-4.793-1.018A48.108 48.108 0 0013.478 5.1c1.282.023 2.56.096 3.82.203"
                  />
                </svg>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default WatchlistTable;