"use client";

import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

export default function HeroEditorPage() {
  const { data, loading, error, save } = useSection("hero");

  if (loading) return <SectionSkeleton rows={4} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField, setImages }) => (
        <div className="space-y-8">

          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <h2 className="text-base font-semibold text-gray-800">Heading & Copy</h2>
            <FieldEditor label="Main Heading" fieldKey="heading" enValue={formData.en?.heading} arValue={formData.ar?.heading} onChange={(lang, val) => setField(lang, "heading", val)} required />
            <FieldEditor label="Subheading" fieldKey="subheading" enValue={formData.en?.subheading} arValue={formData.ar?.subheading} onChange={(lang, val) => setField(lang, "subheading", val)} multiline />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FieldEditor label="Primary CTA Button" fieldKey="cta_primary" enValue={formData.en?.cta_primary} arValue={formData.ar?.cta_primary} onChange={(lang, val) => setField(lang, "cta_primary", val)} />
              <FieldEditor label="Secondary CTA Button" fieldKey="cta_secondary" enValue={formData.en?.cta_secondary} arValue={formData.ar?.cta_secondary} onChange={(lang, val) => setField(lang, "cta_secondary", val)} />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-800">Stats Bar (3 fixed)</h2>
            {(formData.en?.stats || []).map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stat {i + 1}</span>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number <span className="text-gray-400 font-normal">(shared)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.en?.stats?.[i]?.number || ""}
                    onChange={(e) => {
                      const enArr = [...(formData.en?.stats || [])];
                      enArr[i] = { ...enArr[i], number: e.target.value };
                      setField("en", "stats", enArr);
                      const arArr = [...(formData.ar?.stats || [])];
                      arArr[i] = { ...arArr[i], number: e.target.value };
                      setField("ar", "stats", arArr);
                    }}
                    placeholder="e.g. 560+"
                    className="w-full max-w-xs px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#037338] focus:bg-white transition-all"
                  />
                </div>
                <FieldEditor
                  label="Stat Label"
                  fieldKey={"stat_" + i + "_text"}
                  enValue={formData.en?.stats?.[i]?.text}
                  arValue={formData.ar?.stats?.[i]?.text}
                  onChange={(lang, val) => {
                    const arr = [...(formData[lang]?.stats || [])];
                    arr[i] = { ...arr[i], text: val };
                    setField(lang, "stats", arr);
                  }}
                />
              </div>
            ))}
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Hero Background Image</h2>
            <div className="max-w-lg">
              <ImageManager
                label="Background image"
                hint="1920 × 1080 px · landscape · fills full screen"
                value={formData.images?.[0] || null}
                folder="hero"
                slot="background"
                onChange={(img) => setImages(img ? [img] : [])}
              />
            </div>
          </section>

        </div>
      )}
    </SectionForm>
  );
}
