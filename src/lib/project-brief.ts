export type ProjectInput = {
  city: string;
  type: string;
  area: string;
  timing: string;
  needs: string;
};

export function buildProjectBrief(input: ProjectInput): string {
  const value = (text: string, fallback = "待确认") => text.trim() || fallback;
  return [
    "我的大宅项目沟通提纲",
    "",
    `所在城市：${value(input.city)}`,
    `项目方向：${value(input.type)}`,
    `房屋面积：${value(input.area)}`,
    `计划时间：${value(input.timing)}`,
    `具体需求：${value(input.needs, "待沟通")}`,
    "",
    "希望先了解服务匹配度，再沟通具体范围与安排。"
  ].join("\n");
}
