import Layout from "@/components/app/Layout";
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'


export default async function Home() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/board`)
      if (!res.ok) throw new Error("Fail to load")
      return res.json()
    }
  })
  return (<>
    <Layout>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex flex-col gap-4 p-4 ">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
        </div>
      </HydrationBoundary>
    </Layout>

  </>);
}
