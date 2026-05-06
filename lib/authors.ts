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
    bio: "GPT, Claude, Gemini and 40+ models at up to 65% below retail.",
  },
} satisfies Record<string, Author>;

export type AuthorKey = keyof typeof AUTHORS;

export function getAuthor(key: string): Author {
  return (AUTHORS as Record<string, Author>)[key] ?? AUTHORS.client;
}
