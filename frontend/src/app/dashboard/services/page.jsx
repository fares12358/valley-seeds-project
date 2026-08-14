"use client";

import { Plus, Trash2 } from "lucide-react";
import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import IconPicker from "@/components/dashboard/IconPicker";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

export default function ServicesEditorPage() {
  const { data, loading, error, save } = useSection("services");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField, setImages }) => {
        const enValues = formData.en?.values || [];
        const arValues = formData.ar?.values || [];

        const addCard = () => {
          const blank = { name: "", desc: "", icon: "" };
          setField("en", "values", [...enValues, { ...blank }]);
          setField("ar", "values", [...arValues, { ...blank }]);
          setImages([...(formData.images || []), null]);
        };

        const removeCard = (i) => {
          if (enValues.length <= 1) return;
          setField("en", "values", enValues.filter((_, idx) => idx !== i));
          setField("ar", "values", arValues.filter((_, idx) => idx !== i));
          setImages((formData.images || []).filter((_, idx) => idx !== i));
        };

        const moveCard = (i, dir) => {
          const j = i + dir;
          if (j < 0 || j >= enValues.length) return;
          const swapArr = (arr) => {
            const copy = [...arr];
            [copy[i], copy[j]] = [copy[j], copy[i]];
            return copy;
          };
          setField("en", "values", swapArr(enValues));
          setField("ar", "values", swapArr(arValues));
          setImages(swapArr(formData.images || []));
        };

        // Icon is a shared value (not translated) — kept in sync across en/ar
        const updateIcon = (i, val) => {
          const en = [...enValues];
          const ar = [...arValues];
          en[i] = { ...en[i], icon: val };
          ar[i] = { ...ar[i], icon: val };
          setField("en", "values", en);
          setField("ar", "values", ar);
        };

        return (
          <div className="space-y-8">

            {/* Section header fields */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Section Header</h2>
              <FieldEditor label="Eyebrow label" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
              <FieldEditor label="Heading" fieldKey="heading" enValue={formData.en?.heading} arValue={formData.ar?.heading} onChange={(lang, val) => setField(lang, "heading", val)} required />
              <FieldEditor label="Heading accent (green)" fieldKey="heading_accent" enValue={formData.en?.heading_accent} arValue={formData.ar?.heading_accent} onChange={(lang, val) => setField(lang, "heading_accent", val)} />
              <div className="rounded-xl bg-[#037338]/5 border border-[#037338]/15 px-4 py-3 text-sm text-[#037338]">
                <span className="font-semibold">Display rule:</span> The first 4 cards show on the homepage. If you add more, a &quot;Show All Values&quot; button appears linking to the <code className="bg-[#037338]/10 px-1 rounded">/values</code> page where all cards are shown.
              </div>
            </section>

            {/* Value cards — unlimited */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    Value Cards ({enValues.length} total)
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Cards 1–4 shown on homepage · All cards on /values page
                  </p>
                </div>
                <button
                  onClick={addCard}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#037338] hover:text-[#025c2e] transition-colors"
                >
                  <Plus size={16} /> Add card
                </button>
              </div>

              {enValues.map((_, i) => (
                <div
                  key={i}
                  className={`border rounded-xl p-5 space-y-5 ${
                    i < 4
                      ? "border-[#037338]/20 bg-[#037338]/3"
                      : "border-gray-100 bg-gray-50/50"
                  }`}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Card {i + 1}
                      </span>
                      {i < 4 ? (
                        <span className="text-[10px] bg-[#037338] text-white px-1.5 py-0.5 rounded font-medium">
                          Homepage
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                          /values page
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Move up */}
                      <button
                        onClick={() => moveCard(i, -1)}
                        disabled={i === 0}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-20"
                        title="Move up"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      {/* Move down */}
                      <button
                        onClick={() => moveCard(i, 1)}
                        disabled={i === enValues.length - 1}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-20"
                        title="Move down"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => removeCard(i)}
                        disabled={enValues.length <= 1}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                        title="Remove card"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <FieldEditor
                    label="Card name" fieldKey={"value_name_" + i}
                    enValue={enValues[i]?.name} arValue={arValues[i]?.name}
                    onChange={(lang, val) => {
                      const arr = [...(formData[lang]?.values || [])];
                      arr[i] = { ...arr[i], name: val };
                      setField(lang, "values", arr);
                    }} required
                  />
                  <FieldEditor
                    label="Description" fieldKey={"value_desc_" + i}
                    enValue={enValues[i]?.desc} arValue={arValues[i]?.desc}
                    onChange={(lang, val) => {
                      const arr = [...(formData[lang]?.values || [])];
                      arr[i] = { ...arr[i], desc: val };
                      setField(lang, "values", arr);
                    }} multiline
                  />
                  <IconPicker
                    label="Card icon"
                    value={enValues[i]?.icon}
                    onChange={(val) => updateIcon(i, val)}
                  />

                  <ImageManager
                    label={"Card " + (i + 1) + " image"}
                    value={formData.images?.[i] || null}
                    folder="services"
                    slot={"card-" + i}
                    onChange={(img) => {
                      const imgs = [...(formData.images || [])];
                      imgs[i] = img;
                      setImages(imgs);
                    }}
                  />
                </div>
              ))}

              {enValues.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No cards yet. Click &quot;Add card&quot; to start.</p>
              )}
            </section>
          </div>
        );
      }}
    </SectionForm>
  );
}
