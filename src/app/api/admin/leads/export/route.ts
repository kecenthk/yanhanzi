import { fail, guardAdmin } from "@/lib/api";
import { listLeads } from "@/lib/leads-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  const rows = await listLeads();
  const header = ["编号", "提交时间", "称呼", "联系电话", "城市", "项目方向", "面积", "计划时间", "来源", "需求", "已读"];
  const lines = [header.map(cell).join(",")];
  for (const row of rows) {
    lines.push(
      [
        String(row.id),
        new Date(row.createdAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }),
        row.name,
        row.phone,
        row.city,
        row.houseType,
        row.area,
        row.timing,
        row.source,
        row.message,
        row.isRead ? "是" : "否",
      ]
        .map((value) => cell(String(value)))
        .join(",")
    );
  }
  return new Response(`\uFEFF${lines.join("\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
