import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface Item {
  id: string;
  title: string;
  description: string;
}

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch('/api/database');
  
  if (!res.ok) {
    throw error(500, 'Failed to fetch items from API');
  }

  const items: Item[] = await res.json();

  return {
    items
  };
};
