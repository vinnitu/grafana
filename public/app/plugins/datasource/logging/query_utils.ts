const QUERY_REGEXP = /({\w+="[^"]+"})?\s*(\w[^{]+)?\s*({\w+="[^"]+"})?/;
export function parseQuery(input: string) {
  const match = input.match(QUERY_REGEXP);
  let query = '';
  let regexp = '';

  if (match) {
    if (match[1]) {
      query = match[1];
    }
    if (match[2]) {
      regexp = match[2].trim();
    }
    if (match[3]) {
      if (match[1]) {
        query = `${match[1].slice(0, -1)},${match[3].slice(1)}`;
      } else {
        query = match[3];
      }
    }
  }

  return { query, regexp };
}

export function formatQuery(selector: string, search: string): string {
  return `${selector || ''} ${search || ''}`.trim();
}
