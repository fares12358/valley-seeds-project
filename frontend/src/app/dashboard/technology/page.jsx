"use client";

import { Plus, Trash2 } from "lucide-react";
import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import IconPicker from "@/components/dashboard/IconPicker";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

export default function TechnologyEditorPage() {
  const { data, loading, error, save } = useSection("technology");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField, setImages }) => {
        const enCards = formData.en?.cards || [];
        const arCards = formData.ar?.cards || [];

        const addCard = () => {
          const blank = { name: "", desc: "", icon: "" };
          setField("en", "cards", [...enCards, { ...blank }]);
          setField("ar", "cards", [...arCards, { ...blank }]);
          setImages([...(formData.images || []), null]);
        };

        const removeCard = (i) => {
          if (enCards.length <= 1) return;
          setField("en", "cards", enCards.filter((_, idx) => idx !== i));
          setField("ar", "cards", arCards.filter((_, idx) => idx !== i));
          setImages((formData.images || []).filter((_, idx) => idx !== i));
        };

        const moveCard = (i, dir) => {
          const j = i + dir;
          if (j < 0 || j >= enCards.length) return;
          const swapArr = (arr) => {
            const copy = [...arr];
            [copy[i], copy[j]] = [copy[j], copy[i]];
            return copy;
          };
          setField("en", "cards", swapArr(enCards));
          setField("ar", "cards", swapArr(arCards));
          setImages(swapArr(formData.images || []));
        };

        const updateCard = (lang, i, key, val) => {
          const arr = [...(formData[lang]?.cards || [])];
          arr[i] = { ...arr[i], [key]: val };
          setField(lang, "cards", arr);
        };

        const updateIcon = (i, val) => {
          const en = [...enCards];
          const ar = [...arCards];
          en[i] = { ...en[i], icon: val };
          ar[i] = { ...ar[i], icon: val };
          setField("en", "cards", en);
          setField("ar", "cards", ar);
        };

        return (
          <div className="space-y-8">

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Section Header</h2>
              <FieldEditor label="Eyebrow label" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
              <FieldEditor label="Heading line 1" fieldKey="heading_line1" enValue={formData.en?.heading_line1} arValue={formData.ar?.heading_line1} onChange={(lang, val) => setField(lang, "heading_line1", val)} required />
              <FieldEditor label="Heading line 2" fieldKey="heading_line2" enValue={formData.en?.heading_line2} arValue={formData.ar?.heading_line2} onChange={(lang, val) => setField(lang, "heading_line2", val)} />
              <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700">
                <span className="font-semibold">Display:</span> All technology cards are always shown on the website. Cards stack in a responsive grid (1 col → 2 col → 3 col depending on count).
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    Technology Cards ({enCards.length})
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">All cards displayed on the website</p>
                </div>
                <button
                  onClick={addCard}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#037338] hover:text-[#025c2e] transition-colors"
                >
                  <Plus size={16} /> Add card
                </button>
              </div>

              {enCards.map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Card {i + 1} — {enCards[i]?.name || "Untitled"}
                    </span>
                    <div className="flex items-center gap-1">
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
                      <button
                        onClick={() => moveCard(i, 1)}
                        disabled={i === enCards.length - 1}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-20"
                        title="Move down"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeCard(i)}
                        disabled={enCards.length <= 1}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                        title="Remove card"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <FieldEditor
                    label="Card title" fieldKey={"tech_name_" + i}
                    enValue={enCards[i]?.name} arValue={arCards[i]?.name}
                    onChange={(lang, val) => updateCard(lang, i, "name", val)}
                    required
                  />
                  <FieldEditor
                    label="Description" fieldKey={"tech_desc_" + i}
                    enValue={enCards[i]?.desc} arValue={arCards[i]?.desc}
                    onChange={(lang, val) => updateCard(lang, i, "desc", val)}
                    multiline
                  />
                  <IconPicker
                    label="Card icon"
                    value={enCards[i]?.icon}
                    onChange={(val) => updateIcon(i, val)}
                  />
                  <ImageManager
                    label={"Card " + (i + 1) + " image"}
                    hint="800 × 440 px · landscape · 16 : 9 works best"
                    value={formData.images?.[i] || null}
                    folder="technology"
                    slot={"card-" + i}
                    onChange={(img) => {
                      const imgs = [...(formData.images || [])];
                      imgs[i] = img;
                      setImages(imgs);
                    }}
                  />
                </div>
              ))}

              {enCards.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No cards yet. Click "Add card" to start.</p>
              )}
            </section>
          </div>
        );
      }}
    </SectionForm>
  );
}
