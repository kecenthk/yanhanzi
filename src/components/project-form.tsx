"use client";

import { useRef, useState } from "react";
import { buildProjectBrief, type ProjectInput } from "@/lib/project-brief";
import type { PageContentMap } from "@/lib/page-content-defaults";
import { Arrow } from "./ui";

type FormContent = PageContentMap["contact"]["form"];

export function ProjectForm({ enabled, content }: { enabled: boolean; content: FormContent }) {
  const [brief, setBrief] = useState("");
  const [copyState, setCopyState] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [input, setInput] = useState<ProjectInput>({ city: "", type: content.directionOptions[0], area: "", timing: content.timingOptions[0], needs: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  function update(field: keyof ProjectInput, value: string) {
    setInput(previous => ({ ...previous, [field]: value }));
  }

  function createBrief() {
    setBrief(buildProjectBrief(input));
    setCopyState("");
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyState("提纲已复制，可保存后用于后续沟通。");
    } catch {
      outputRef.current?.focus();
      outputRef.current?.select();
      setCopyState("请长按或使用复制快捷键，复制已选中的提纲。");
    }
  }

  async function submit() {
    if (!enabled || submitting) return;
    setSubmitMessage("");
    if (!name.trim() || !phone.trim()) {
      setSubmitMessage("请填写称呼和联系电话。");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          city: input.city,
          houseType: input.type,
          area: input.area,
          timing: input.timing,
          message: input.needs,
          intent: input.type,
          source: "contact",
        }),
      });
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        setSubmitMessage(data?.message || content.errorText);
        return;
      }
      setSubmitted(true);
      setSubmitMessage(content.successText);
    } catch {
      setSubmitMessage(content.errorText);
    } finally {
      setSubmitting(false);
    }
  }

  return <div>
    <div className="form-notice"><span className="status-dot" /><div><p>{enabled ? content.enabledNoticeTitle : content.noticeTitle}</p><p className="mt-2 text-sm text-muted">{enabled ? content.enabledNoticeText : content.noticeText}</p></div></div>
    <noscript><p className="mt-5 text-sm text-muted">{content.disabledNote}</p></noscript>
    <div className="project-form" role="group" aria-label="项目需求">
      {enabled ? <div className="grid gap-7 sm:grid-cols-2">
        <label>{content.nameLabel}<input name="name" value={name} onChange={event => setName(event.target.value)} placeholder={content.namePlaceholder} maxLength={100} autoComplete="name" /></label>
        <label>{content.phoneLabel}<input name="phone" value={phone} onChange={event => setPhone(event.target.value)} placeholder={content.phonePlaceholder} maxLength={50} inputMode="tel" autoComplete="tel" /></label>
      </div> : null}
      <div className="grid gap-7 sm:grid-cols-2">
        <label>{content.cityLabel}<input name="city" value={input.city} onChange={event => update("city", event.target.value)} placeholder={content.cityPlaceholder} maxLength={50} /></label>
        <label>{content.directionLabel}<select name="type" value={input.type} onChange={event => update("type", event.target.value)}>{content.directionOptions.map(option => <option key={option}>{option}</option>)}</select></label>
        <label>{content.areaLabel}<input name="area" value={input.area} onChange={event => update("area", event.target.value)} placeholder={content.areaPlaceholder} maxLength={50} /></label>
        <label>{content.timingLabel}<select name="timing" value={input.timing} onChange={event => update("timing", event.target.value)}>{content.timingOptions.map(option => <option key={option}>{option}</option>)}</select></label>
      </div>
      <label className="mt-7 block">{content.needsLabel}<textarea name="needs" value={input.needs} onChange={event => update("needs", event.target.value)} rows={4} maxLength={2000} placeholder={content.needsPlaceholder} /></label>
      <div className="mt-8 flex flex-wrap items-center gap-5">
        <button className="button" type="button" onClick={createBrief}>{content.generateLabel}<Arrow /></button>
        {enabled ? <button className="button" type="button" onClick={submit} disabled={submitting || submitted}>{submitted ? "已提交" : submitting ? content.submittingLabel : content.submitLabel}<Arrow /></button> : null}
      </div>
    </div>
    {brief ? <div className="brief-result" aria-live="polite"><h3 className="font-serif text-2xl">{content.briefTitle}</h3><textarea ref={outputRef} value={brief} readOnly rows={11} aria-label={content.briefTitle} /><button type="button" className="text-link" onClick={copyBrief}>{content.copyLabel}<Arrow /></button><p role="status" className="mt-3 text-sm text-muted">{copyState}</p><p className="mt-4 text-xs text-muted">{content.briefNote}</p></div> : null}
    {submitMessage ? <p role="status" className={submitted ? "mt-5 text-sm" : "mt-5 text-sm text-muted"}>{submitMessage}</p> : null}
  </div>;
}
