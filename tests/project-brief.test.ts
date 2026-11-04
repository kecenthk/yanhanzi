import { test } from "node:test";
import assert from "node:assert/strict";
import { buildProjectBrief } from "../src/lib/project-brief";
import { POST } from "../src/app/api/inquiries/route";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectForm } from "../src/components/project-form";
import { pageContentDefaults } from "../src/lib/page-content-defaults";

test("需求提纲保留访客实际选择并清理首尾空白", () => {
  const result = buildProjectBrief({ city: " 东莞 ", type: "精装升级", area: " 160㎡ ", timing: "半年内", needs: " 希望改善玄关收纳 " });
  assert.match(result, /所在城市：东莞/);
  assert.match(result, /项目方向：精装升级/);
  assert.match(result, /房屋面积：160㎡/);
  assert.match(result, /希望改善玄关收纳/);
});

test("空白选填项明确显示尚未确定，不制造预算与服务承诺", () => {
  const result = buildProjectBrief({ city: " ", type: "旧房整装", area: "", timing: "", needs: "" });
  assert.match(result, /所在城市：待确认/);
  assert.match(result, /房屋面积：待确认/);
  assert.match(result, /具体需求：待沟通/);
  assert.doesNotMatch(result, /免费|24小时|35万/);
});

test("未配置咨询渠道时接口返回503，不接收也不回显信息", async () => {
  const response = await POST(new Request("http://localhost/api/inquiries", { method: "POST" }));
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.code, "CONTACT_NOT_CONFIGURED");
  assert.match(body.message, /尚未开通/);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("JavaScript不可用时需求输入没有浏览器原生提交路径", () => {
  const markup = renderToStaticMarkup(
    createElement(ProjectForm, { enabled: false, content: pageContentDefaults.contact.form })
  );
  assert.doesNotMatch(markup, /<form(?:\s|>)/);
  assert.doesNotMatch(markup, /type="submit"/);
});
