export async function load({ params, fetch }) {
  try {
    const response = await fetch(`/api/database?id=${params.id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const item = await response.json();
    
    if (!item) {
      throw new Error(`Item with ID ${params.id} not found`);
    }
    
    return { item };
  } catch (error) {
    console.error('Error loading item:', error);
    throw error;
  }
}