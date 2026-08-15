"use client";

import { Plus, Trash2 } from "lucide-react";
import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

export default function WhyUsEditorPage() {
  const { data, loading, error, save } = useSection("whyUs");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField }) => {
        const enReasons = formData.en?.reasons || [];
        const arReasons = formData.ar?.reasons || [];

        const addReason = () => {
          if (enReasons.length >= 10) return;
          const num = String(enReasons.length + 1).padStart(2, "0");
          const blank = { num, title: "", desc: "" };
          setField("en", "reasons", [...enReasons, { ...blank }]);
          setField("ar", "reasons", [...arReasons, { ...blank }]);
        };

        const removeReason = (i) => {
          if (enReasons.length <= 1) return;
          // Re-number sequentially after removal, keeping each lang's own num value in sync
          const renum = (arr) =>
            arr
              .filter((_, idx) => idx !== i)
              .map((r, idx) => ({ ...r, num: String(idx + 1).padStart(2, "0") }));
          setField("en", "reasons", renum(enReasons));
          setField("ar", "reasons", renum(arReasons));
        };

        const updateReason = (lang, i, key, val) => {
          const arr = [...(formData[lang]?.reasons || [])];
          arr[i] = { ...arr[i], [key]: val };
          setField(lang, "reasons", arr);
        };

        return (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Section Header</h2>
              <FieldEditor label="Eyebrow label" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
              <FieldEditor label="Heading line 1" fieldKey="heading_line1" enValue={formData.en?.heading_line1} arValue={formData.ar?.heading_line1} onChange={(lang, val) => setField(lang, "heading_line1", val)} required />
              <FieldEditor label="Heading line 2" fieldKey="heading_line2" enValue={formData.en?.heading_line2} arValue={formData.ar?.heading_line2} onChange={(lang, val) => setField(lang, "heading_line2", val)} />
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">Reasons ({enReasons.length}/10)</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Number display is now independent per language (e.g. Arabic numerals in AR).</p>
                </div>
                <button
                  onClick={addReason}
                  disabled={enReasons.length >= 10}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#037338] hover:text-[#025c2e] disabled:opacity-40 transition-colors"
                >
                  <Plus size={16} /> Add reason
                </button>
              </div>

              {enReasons.map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Preview both lang num values side by side */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-[#96C422]">
                        {enReasons[i]?.num || String(i + 1).padStart(2, "0")}
                      </span>
                      {arReasons[i]?.num && arReasons[i].num !== enReasons[i]?.num && (
                        <span className="text-2xl font-bold text-[#96C422]/60 font-arabic" dir="rtl">
                          {arReasons[i].num}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeReason(i)}
                      disabled={enReasons.length <= 1}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Number is now per-lang via FieldEditor */}
                  <FieldEditor
                    label="Number display"
                    fieldKey={"reason_num_" + i}
                    enValue={enReasons[i]?.num}
                    arValue={arReasons[i]?.num}
                    onChange={(lang, val) => updateReason(lang, i, "num", val)}
                  />
                  <FieldEditor
                    label="Title"
                    fieldKey={"reason_title_" + i}
                    enValue={enReasons[i]?.title}
                    arValue={arReasons[i]?.title}
                    onChange={(lang, val) => updateReason(lang, i, "title", val)}
                    required
                  />
                  <FieldEditor
                    label="Description"
                    fieldKey={"reason_desc_" + i}
                    enValue={enReasons[i]?.desc}
                    arValue={arReasons[i]?.desc}
                    onChange={(lang, val) => updateReason(lang, i, "desc", val)}
                    multiline
                  />
                </div>
              ))}
            </section>
          </div>
        );
      }}
    </SectionForm>
  );
}
