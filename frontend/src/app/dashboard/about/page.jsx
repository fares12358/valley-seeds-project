"use client";

import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

export default function AboutEditorPage() {
  const { data, loading, error, save } = useSection("about");

  if (loading) return <SectionSkeleton rows={4} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField, setImages }) => (
        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <h2 className="text-base font-semibold text-gray-800">Text Content</h2>
            <FieldEditor label="Eyebrow label" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
            <FieldEditor label="Heading line 1" fieldKey="heading_line1" enValue={formData.en?.heading_line1} arValue={formData.ar?.heading_line1} onChange={(lang, val) => setField(lang, "heading_line1", val)} required />
            <FieldEditor label="Heading line 2" fieldKey="heading_line2" enValue={formData.en?.heading_line2} arValue={formData.ar?.heading_line2} onChange={(lang, val) => setField(lang, "heading_line2", val)} />
            <FieldEditor label="Body paragraph" fieldKey="body" enValue={formData.en?.body} arValue={formData.ar?.body} onChange={(lang, val) => setField(lang, "body", val)} multiline required />
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageManager
                label="Main image (large)"
                hint="800 × 600 px · portrait or landscape"
                value={formData.images?.[0] || null}
                folder="about"
                slot="main"
                onChange={(img) => {
                  const imgs = [...(formData.images || [null, null])];
                  imgs[0] = img;
                  setImages(imgs);
                }}
              />
              <ImageManager
                label="Secondary image (overlay)"
                hint="600 × 500 px · portrait"
                value={formData.images?.[1] || null}
                folder="about"
                slot="secondary"
                onChange={(img) => {
                  const imgs = [...(formData.images || [null, null])];
                  imgs[1] = img;
                  setImages(imgs);
                }}
              />
            </div>
          </section>
        </div>
      )}
    </SectionForm>
  );
}
