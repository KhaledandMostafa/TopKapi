"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const Query = new QueryClient();

export default function ReactQuery({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={Query}>
      {children};<ReactQueryDevtools />
    </QueryClientProvider>
  );
}
