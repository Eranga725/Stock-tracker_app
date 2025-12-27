import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getWatchlistByEmail } from "@/lib/actions/watchlist.actions";
import WatchlistTable from "@/components/WatchlistTable";

export default async function Watchlist() {
  const headersList = await headers();
  const sessionHeaders: Record<string, string> = {};
  for (const [key, value] of headersList.entries()) {
    sessionHeaders[key] = value;
  }
  const session = await auth.api.getSession({ headers: sessionHeaders });
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return (
      <div className="p-4 md:p-6 text-center">
        <p>Please log in to see your watchlist.</p>
      </div>
    );
  }

  const watchlist = await getWatchlistByEmail(userEmail);
  const plainWatchlist = JSON.parse(JSON.stringify(watchlist));

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
      <WatchlistTable initialWatchlist={plainWatchlist} userEmail={userEmail} />
    </div>
  );
}