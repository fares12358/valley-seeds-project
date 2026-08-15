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
            <p className="text-xs text-gray-400 -mt-2">
              The number value is now independent per language — useful when Arabic uses Arabic numerals or different formatting (e.g. <span className="font-mono">+560</span> in EN vs <span className="font-mono">٥٦٠+</span> in AR).
            </p>
            {(formData.en?.stats || []).map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stat {i + 1}</span>
                <FieldEditor
                  label="Number"
                  fieldKey={"stat_" + i + "_number"}
                  enValue={formData.en?.stats?.[i]?.number}
                  arValue={formData.ar?.stats?.[i]?.number}
                  onChange={(lang, val) => {
                    const arr = [...(formData[lang]?.stats || [])];
                    arr[i] = { ...arr[i], number: val };
                    setField(lang, "stats", arr);
                  }}
                />
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
