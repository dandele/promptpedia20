import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface Item {
  id: string;
  title: string;
  description: string;
}

interface ApiResponse {
  items: Item[];
  hasMore: boolean;
  nextCursor: string | null;
}

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch('/api/database');
  
  if (!res.ok) {
    throw error(500, 'Failed to fetch items from API');
  }

  const data: ApiResponse = await res.json();

  return {
    items: data.items,
    hasMore: data.hasMore,
    nextCursor: data.nextCursor
  };
};
