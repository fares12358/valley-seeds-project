"use client";

import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

export default function MissionEditorPage() {
  const { data, loading, error, save } = useSection("mission");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField }) => (
        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <h2 className="text-base font-semibold text-gray-800">Section Eyebrow</h2>
            <FieldEditor label="Eyebrow label" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <h2 className="text-base font-semibold text-gray-800">Vision Card</h2>
            <FieldEditor label="Badge label" fieldKey="vision_badge" enValue={formData.en?.vision?.badge} arValue={formData.ar?.vision?.badge} onChange={(lang, val) => setField(lang, "vision", { ...formData[lang]?.vision, badge: val })} />
            <FieldEditor label="Heading" fieldKey="vision_heading" enValue={formData.en?.vision?.heading} arValue={formData.ar?.vision?.heading} onChange={(lang, val) => setField(lang, "vision", { ...formData[lang]?.vision, heading: val })} required />
            <FieldEditor label="Body text" fieldKey="vision_body" enValue={formData.en?.vision?.body} arValue={formData.ar?.vision?.body} onChange={(lang, val) => setField(lang, "vision", { ...formData[lang]?.vision, body: val })} multiline required />
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <h2 className="text-base font-semibold text-gray-800">Mission Card</h2>
            <FieldEditor label="Badge label" fieldKey="mission_badge" enValue={formData.en?.missionCard?.badge} arValue={formData.ar?.missionCard?.badge} onChange={(lang, val) => setField(lang, "missionCard", { ...formData[lang]?.missionCard, badge: val })} />
            <FieldEditor label="Heading" fieldKey="mission_heading" enValue={formData.en?.missionCard?.heading} arValue={formData.ar?.missionCard?.heading} onChange={(lang, val) => setField(lang, "missionCard", { ...formData[lang]?.missionCard, heading: val })} required />
            <FieldEditor label="Body text" fieldKey="mission_body" enValue={formData.en?.missionCard?.body} arValue={formData.ar?.missionCard?.body} onChange={(lang, val) => setField(lang, "missionCard", { ...formData[lang]?.missionCard, body: val })} multiline required />
          </section>
        </div>
      )}
    </SectionForm>
  );
}
