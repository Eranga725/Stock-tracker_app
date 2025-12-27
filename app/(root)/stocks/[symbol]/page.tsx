import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import {
  addToWatchlist,
  getWatchlistSymbolsByEmail,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";
import { getCompanyProfile } from "@/lib/actions/finnhub.actions";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  const headersList = await headers();
  const sessionHeaders: Record<string, string> = {};
  for (const [key, value] of headersList.entries()) {
    sessionHeaders[key] = value;
  }
  const session = await auth.api.getSession({ headers: sessionHeaders });
  const userEmail = session?.user?.email;

  const [watchlistSymbols, companyProfile] = await Promise.all([
    userEmail ? getWatchlistSymbolsByEmail(userEmail) : Promise.resolve([]),
    getCompanyProfile(symbol),
  ]);

  const isInWatchlist = userEmail ? watchlistSymbols.includes(symbol) : false;
  const companyName = companyProfile?.name || symbol.toUpperCase();

  const handleWatchlistChange = async (stockSymbol: string, adding: boolean) => {
    "use server";
    if (!userEmail) return;

    if (adding) {
      await addToWatchlist(userEmail, stockSymbol, companyName);
    } else {
      await removeFromWatchlist(userEmail, stockSymbol);
    }
  };

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            {userEmail && (
              <WatchlistButton
                symbol={symbol.toUpperCase()}
                company={companyName}
                isInWatchlist={isInWatchlist}
                onWatchlistChange={handleWatchlistChange}
              />
            )}
          </div>

          <TradingViewWidget
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            height={400}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}company-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={440}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
}