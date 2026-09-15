export type Author = {
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
  url?: string;
};

export const AUTHORS = {
  client: {
    name: "TokenMart Team",
    role: "TokenMart",
    bio: "Frontier model APIs through one key, priced under provider list.",
  },
} satisfies Record<string, Author>;

export type AuthorKey = keyof typeof AUTHORS;

export function getAuthor(key: string): Author {
  return (AUTHORS as Record<string, Author>)[key] ?? AUTHORS.client;
}
