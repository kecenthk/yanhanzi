import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return <section className="not-found wrap"><div><p className="font-serif text-3xl text-muted">404</p><h1 className="page-title mt-6">这里还没有内容。</h1><p className="mt-5 text-muted">可以从案例与服务重新开始，找到你想了解的空间。</p><div className="mt-9"><ButtonLink href="/">返回首页</ButtonLink></div></div></section>;
}
