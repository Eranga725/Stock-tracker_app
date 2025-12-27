'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { revalidatePath } from 'next/cache';

async function getUserIdByEmail(email: string) {
  if (!email) return null;

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    const user = await db
      .collection('user')
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return null;
    return (user.id as string) || String(user._id || '');
  } catch (err) {
    console.error('getUserIdByEmail error:', err);
    return null;
  }
}

export async function getWatchlistByEmail(email: string) {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) return [];

    return await Watchlist.find({ userId }).lean();
  } catch (err) {
    console.error('getWatchlistByEmail error:', err);
    return [];
  }
}

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  const watchlist = await getWatchlistByEmail(email);
  return watchlist.map((i) => String(i.symbol));
}

export async function addToWatchlist(email: string, symbol: string, company: string) {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) throw new Error('User not found');

    const newItem = await Watchlist.create({
      userId,
      symbol,
      company,
    });

    revalidatePath(`/stocks/${symbol}`);
    revalidatePath('/watchlist');

    return newItem;
  } catch (err) {
    console.error('addToWatchlist error:', err);
    throw new Error('Failed to add to watchlist');
  }
}

export async function removeFromWatchlist(email: string, symbol: string) {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) throw new Error('User not found');

    const deletedItem = await Watchlist.findOneAndDelete({ userId, symbol });

    revalidatePath(`/stocks/${symbol}`);
    revalidatePath('/watchlist');

    return deletedItem;
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    throw new Error('Failed to remove from watchlist');
  }
}