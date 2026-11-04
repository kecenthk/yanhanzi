"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminSend } from "./admin-client";

type Json = string | number | boolean | null | Json[] | JsonObject;
type JsonObject = { [key: string]: Json };
type Path = (string | number)[];

const keyLabels: Record<string, string> = {
  // 顶层结构
  brand: "品牌信息",
  nav: "导航栏目",
  headerCta: "头部行动按钮",
  footer: "页脚",
  contactBand: "通用行动区",
  hero: "首屏",
  cases: "案例区块",
  questions: "问题列表",
  method: "四维方法区块",
  service: "服务区块",
  founder: "主理人区块",
  faq: "常见问题",
  alliance: "联盟区块",
  meta: "页面标题与描述",
  intro: "页面导语",
  section: "案例列表文案",
  detail: "案例详情页文案",
  methods: "四个维度",
  note: "说明备注",
  linkLabel: "链接文案",
  linkHref: "链接地址",
  types: "服务类型",
  process: "合作阶段",
  steps: "流程步骤",
  budget: "预算说明",
  items: "条目列表",
  support: "支持方向",
  fit: "适合伙伴",
  aside: "联系信息",
  form: "咨询表单",
  alliancePanel: "联盟沟通说明",
  sections: "隐私章节",
  team: "团队分工",
  question: "主张句",

  // 通用字段
  title: "标题",
  subtitle: "副标题",
  description: "描述",
  text: "说明文字",
  text1: "说明一",
  text2: "说明二",
  quote: "引言",
  body: "内容",
  answer: "回答",
  summary: "摘要",
  label: "显示文案",
  href: "链接地址",
  id: "标识",
  no: "编号",
  name: "名称",
  output: "阶段成果",
  points: "要点",
  paragraphs: "段落",
  sourceNote: "素材来源说明",
  metaNote: "案例说明",
  imageNote: "图片说明",
  privacyNote: "隐私提醒",
  visitText: "到店说明",
  noticeText: "状态说明",
  enabledNoticeText: "开启后说明",
  disabledNote: "无脚本提示",
  caption: "图片注脚",
  tagline: "品牌主张",

  // 品牌与页脚
  prefix: "品牌前缀",
  suffix: "品牌后缀",
  english: "英文名",
  location: "品牌所在地",
  contactTitle: "行动区标题",
  contactPlaceholder: "联系方式占位",
  requirementLabel: "需求整理入口",
  copyrightName: "版权名称",
  copyrightNote: "版权说明",
  extraLinks: "页脚附加链接",

  // 行动区
  homeTitle: "首页行动区标题",
  homeText: "首页行动区说明",
  homeCta: "首页行动按钮",
  allianceTitle: "联盟行动区标题",
  allianceText: "联盟行动区说明",
  allianceCta: "联盟行动按钮",

  // 首屏与区块
  ctaLabel: "按钮文案",
  ctaHref: "按钮链接",
  image: "图片地址",
  imageAlt: "图片替代文本",
  imageAltSuffix: "图片替代文本后缀",

  // 案例详情
  metaCityLabel: "城市标签",
  metaCityValue: "城市内容",
  metaLocationLabel: "位置标签",
  metaLocationValue: "位置内容",
  metaSourceLabel: "来源标签",
  metaSourceValue: "来源内容",
  metaContentLabel: "内容标签",
  metaContentValue: "内容说明",
  observationTitle: "空间观察标题",
  imageCaptionPrefix: "图片说明前缀",
  methodLinkLabel: "方法链接文案",
  otherTitle: "其他案例标题",
  backLabel: "返回链接文案",
  cardNote: "案例卡片说明",

  // 咨询
  projectTitle: "项目咨询标题",
  projectDescription: "项目咨询说明",
  allianceDescription: "联盟咨询说明",
  phoneLabel: "电话标签",
  wechatLabel: "微信标签",
  emailLabel: "邮箱标签",
  visitLabel: "到店标签",
  placeholder: "待配置占位",
  noticeTitle: "状态标题",
  enabledNoticeTitle: "开启后标题",
  nameLabel: "称呼标签",
  namePlaceholder: "称呼占位",
  phonePlaceholder: "电话占位",
  cityLabel: "城市标签",
  cityPlaceholder: "城市占位",
  directionLabel: "项目方向标签",
  directionOptions: "项目方向选项",
  areaLabel: "面积标签",
  areaPlaceholder: "面积占位",
  timingLabel: "计划时间标签",
  timingOptions: "计划时间选项",
  needsLabel: "需求标签",
  needsPlaceholder: "需求占位",
  generateLabel: "生成提纲按钮",
  briefTitle: "提纲标题",
  copyLabel: "复制提纲按钮",
  briefNote: "提纲说明",
  submitLabel: "提交按钮",
  submittingLabel: "提交中提示",
  successText: "成功提示",
  errorText: "失败提示",
};

const multilineKeys = new Set([
  "title",
  "subtitle",
  "description",
  "text",
  "text1",
  "text2",
  "quote",
  "body",
  "answer",
  "summary",
  "note",
  "sourceNote",
  "metaNote",
  "imageNote",
  "privacyNote",
  "visitText",
  "noticeText",
  "enabledNoticeText",
  "disabledNote",
  "caption",
  "tagline",
  "question",
  "noticeTitle",
  "enabledNoticeTitle",
  "projectDescription",
  "allianceDescription",
  "needsPlaceholder",
  "briefNote",
  "successText",
  "errorText",
  "contactPlaceholder",
  "copyrightNote",
]);

function labelFor(key: string) {
  return keyLabels[key] || key;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function updateAt(root: Json, path: Path, next: Json): Json {
  if (path.length === 0) return next;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const index = typeof head === "number" ? head : Number(head);
    const copy = root.slice();
    copy[index] = updateAt(root[index], rest, next);
    return copy;
  }
  if (root && typeof root === "object") {
    const key = String(head);
    const source = root as JsonObject;
    return { ...source, [key]: updateAt(source[key], rest, next) };
  }
  return root;
}

function blankLike(sample: Json): Json {
  if (typeof sample === "string") return "";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    const result: JsonObject = {};
    for (const [key, value] of Object.entries(sample)) result[key] = blankLike(value);
    return result;
  }
  return "";
}

function rowsFor(value: string) {
  const lines = value.split("\n").length;
  const extra = value.length > 240 ? 4 : value.length > 120 ? 2 : value.length > 60 ? 1 : 0;
  return Math.min(12, Math.max(2, lines + extra));
}

export function PageEditor({
  pageKey,
  pageLabel,
  pagePath,
  initialContent,
  databaseReady,
}: {
  pageKey: string;
  pageLabel: string;
  pagePath: string;
  initialContent: unknown;
  databaseReady: boolean;
}) {
  const [content, setContent] = useState<Json>(() => deepClone(initialContent as Json));
  const [baseline, setBaseline] = useState(() => JSON.stringify(initialContent));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const dirty = JSON.stringify(content) !== baseline;

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function setValue(path: Path, next: Json) {
    setContent((current) => updateAt(current, path, next));
    setNotice("");
  }

  async function save() {
    setSaving(true);
    setError("");
    setNotice("");
    const result = await adminSend<{ content: Json }>(`/api/admin/pages/${pageKey}`, "PATCH", { content });
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setContent(result.data.content);
    setBaseline(JSON.stringify(result.data.content));
    setNotice("页面文案已保存，前台即时生效。");
  }

  async function reset() {
    if (!window.confirm("恢复默认文案会清除该页面的自定义内容，确定继续吗？")) return;
    setSaving(true);
    setError("");
    setNotice("");
    const result = await adminSend<{ content: Json }>(`/api/admin/pages/${pageKey}`, "DELETE");
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setContent(result.data.content);
    setBaseline(JSON.stringify(result.data.content));
    setNotice("已恢复默认文案。");
  }

  function renderStringField(key: string, value: string, path: Path, hideLabel = false) {
    if (multilineKeys.has(key) || value.includes("\n")) {
      const control = (
        <textarea rows={rowsFor(value)} value={value} onChange={(event) => setValue(path, event.target.value)} />
      );
      if (hideLabel) return control;
      return (
        <label className="admin-field" key={path.join("-")}>
          <span>{labelFor(key)}</span>
          {control}
          <small>{key}</small>
        </label>
      );
    }
    const control = <input value={value} onChange={(event) => setValue(path, event.target.value)} />;
    if (hideLabel) return control;
    return (
      <label className="admin-field" key={path.join("-")}>
        <span>{labelFor(key)}</span>
        {control}
        <small>{key}</small>
      </label>
    );
  }

  function renderArrayItem(key: string, item: Json, path: Path) {
    if (typeof item === "string") {
      const multiline = item.includes("\n") || item.length > 60;
      return multiline ? (
        <textarea
          className="admin-textarea"
          rows={3}
          value={item}
          onChange={(event) => setValue(path, event.target.value)}
          aria-label={`${labelFor(key)}第 ${Number(path[path.length - 1]) + 1} 项`}
        />
      ) : (
        <input
          className="admin-input"
          value={item}
          onChange={(event) => setValue(path, event.target.value)}
          aria-label={`${labelFor(key)}第 ${Number(path[path.length - 1]) + 1} 项`}
        />
      );
    }
    if (typeof item === "number") {
      return (
        <input
          className="admin-input"
          type="number"
          value={item}
          onChange={(event) => setValue(path, Number(event.target.value))}
        />
      );
    }
    if (typeof item === "boolean") {
      return (
        <label className="admin-check">
          <input type="checkbox" checked={item} onChange={(event) => setValue(path, event.target.checked)} />
          <span>启用</span>
        </label>
      );
    }
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return (
        <div className="admin-form-grid">
          {Object.entries(item as JsonObject).map(([childKey, childValue]) =>
            renderField(childKey, childValue, [...path, childKey])
          )}
        </div>
      );
    }
    return null;
  }

  function renderArray(key: string, list: Json[], path: Path, showLabel = true) {
    return (
      <div className="admin-field span-2" key={path.join("-")}>
        <div className="admin-array-head">
          <span>
            {showLabel ? <strong>{labelFor(key)}</strong> : null} <small>{key} · {list.length} 项</small>
          </span>
          <button
            type="button"
            className="admin-btn admin-btn-sm"
            onClick={() => setValue(path, [...list, blankLike(list[0] ?? "")])}
            disabled={list.length >= 40}
          >
            添加一项
          </button>
        </div>
        {list.length === 0 ? <p className="admin-array-empty">暂无内容，可点击「添加一项」。</p> : null}
        <div className="admin-editor-array">
          {list.map((item, index) => (
            <div className="admin-detail-row" key={`${path.join("-")}-${index}`}>
              <div className="row-head">
                <span>第 {index + 1} 项</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-sm"
                    onClick={() => {
                      const copy = list.slice();
                      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
                      setValue(path, copy);
                    }}
                    disabled={index === 0}
                  >
                    上移
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-sm"
                    onClick={() => {
                      const copy = list.slice();
                      [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
                      setValue(path, copy);
                    }}
                    disabled={index === list.length - 1}
                  >
                    下移
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-sm admin-btn-danger"
                    onClick={() => setValue(path, list.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    删除
                  </button>
                </div>
              </div>
              {renderArrayItem(key, item, [...path, index])}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderField(key: string, value: Json, path: Path) {
    if (Array.isArray(value)) return renderArray(key, value, path);
    if (typeof value === "string") return renderStringField(key, value, path);
    if (typeof value === "number") {
      return (
        <label className="admin-field" key={path.join("-")}>
          <span>{labelFor(key)}</span>
          <input type="number" value={value} onChange={(event) => setValue(path, Number(event.target.value))} />
          <small>{key}</small>
        </label>
      );
    }
    if (typeof value === "boolean") {
      return (
        <label className="admin-check" key={path.join("-")}>
          <input type="checkbox" checked={value} onChange={(event) => setValue(path, event.target.checked)} />
          <span>{labelFor(key)}</span>
        </label>
      );
    }
    if (value && typeof value === "object") {
      return (
        <div className="admin-field span-2" key={path.join("-")}>
          <span>{labelFor(key)}</span>
          <div className="admin-editor-sub">
            <div className="admin-form-grid">
              {Object.entries(value as JsonObject).map(([childKey, childValue]) =>
                renderField(childKey, childValue, [...path, childKey])
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  const groups = content && typeof content === "object" && !Array.isArray(content) ? Object.entries(content) : [];

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>{pageLabel}</h1>
          <p>
            页面路径 {pagePath} · 共 {groups.length} 组文案。字段下方的小字为字段标识，便于对照前台位置。
          </p>
        </div>
        <div className="admin-page-actions">
          <a className="admin-btn" href={pagePath} target="_blank" rel="noreferrer">
            查看页面
          </a>
          <Link className="admin-btn" href="/admin/pages">
            返回列表
          </Link>
        </div>
      </div>

      {databaseReady ? null : (
        <div className="admin-alert error">尚未配置数据库，当前仅能查看默认文案，无法保存修改。</div>
      )}
      {error ? <div className="admin-alert error" style={{ marginTop: 16 }}>{error}</div> : null}

      {groups.map(([key, value]) => (
        <section className="admin-card" key={key}>
          <div className="admin-editor-group">
            <h3>
              {labelFor(key)} <small>{key}</small>
            </h3>
            {Array.isArray(value) ? (
              renderArray(key, value, [key], false)
            ) : value && typeof value === "object" ? (
              <div className="admin-form-grid">
                {Object.entries(value as JsonObject).map(([childKey, childValue]) =>
                  renderField(childKey, childValue, [key, childKey])
                )}
              </div>
            ) : (
              <div className="admin-form-grid">
                {typeof value === "string" ? renderStringField(key, value, [key], true) : renderField(key, value, [key])}
              </div>
            )}
          </div>
        </section>
      ))}

      <div className="admin-sticky-actions">
        <span className="status">{dirty ? "有未保存的修改" : notice || "当前文案已保存"}</span>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="admin-btn" onClick={reset} disabled={!databaseReady || saving}>
            恢复默认
          </button>
          <button type="button" className="admin-btn-primary" onClick={save} disabled={!databaseReady || saving || !dirty}>
            {saving ? "保存中…" : "保存文案"}
          </button>
        </div>
      </div>
    </>
  );
}
