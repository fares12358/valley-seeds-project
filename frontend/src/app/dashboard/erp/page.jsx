"use client";

import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import IconPicker from "@/components/dashboard/IconPicker";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

export default function ErpEditorPage() {
  const { data, loading, error, save } = useSection("erp");

  if (loading) return <SectionSkeleton rows={4} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField }) => {
        const enPoints = formData.en?.points || [];
        const arPoints = formData.ar?.points || [];
        const enItems  = formData.en?.dashboard?.items || [];
        const arItems  = formData.ar?.dashboard?.items || [];

        const updatePoint = (lang, i, key, val) => {
          const arr = [...(formData[lang]?.points || [])];
          arr[i] = { ...arr[i], [key]: val };
          setField(lang, "points", arr);
        };

        const updateDashField = (lang, key, val) =>
          setField(lang, "dashboard", { ...formData[lang]?.dashboard, [key]: val });

        const updateDashItem = (lang, i, key, val) => {
          const arr = [...(formData[lang]?.dashboard?.items || [])];
          arr[i] = { ...arr[i], [key]: val };
          setField(lang, "dashboard", { ...formData[lang]?.dashboard, items: arr });
        };

        // Icon is purely decorative / non-translatable — keep it shared across both langs
        const updateIcon = (i, val) => {
          updateDashItem("en", i, "icon", val);
          updateDashItem("ar", i, "icon", val);
        };

        return (
          <div className="space-y-8">

            {/* Section copy */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Section Copy</h2>
              <FieldEditor label="Eyebrow label"   fieldKey="eyebrow"         enValue={formData.en?.eyebrow}         arValue={formData.ar?.eyebrow}         onChange={(lang, val) => setField(lang, "eyebrow", val)} />
              <FieldEditor label="Heading"          fieldKey="heading"         enValue={formData.en?.heading}         arValue={formData.ar?.heading}         onChange={(lang, val) => setField(lang, "heading", val)} required />
              <FieldEditor label="Heading accent"   fieldKey="heading_accent"  enValue={formData.en?.heading_accent}  arValue={formData.ar?.heading_accent}  onChange={(lang, val) => setField(lang, "heading_accent", val)} />
              <FieldEditor label="Body paragraph"   fieldKey="body"            enValue={formData.en?.body}            arValue={formData.ar?.body}            onChange={(lang, val) => setField(lang, "body", val)} multiline required />
            </section>

            {/* ERP points */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">ERP Points (3 fixed)</h2>
              {[0, 1, 2].map((i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Point {i + 1}</span>
                  <FieldEditor label="Title"       fieldKey={"point_title_" + i} enValue={enPoints[i]?.title} arValue={arPoints[i]?.title} onChange={(lang, val) => updatePoint(lang, i, "title", val)} required />
                  <FieldEditor label="Description" fieldKey={"point_text_"  + i} enValue={enPoints[i]?.text}  arValue={arPoints[i]?.text}  onChange={(lang, val) => updatePoint(lang, i, "text",  val)} multiline />
                </div>
              ))}
            </section>

            {/* Dashboard widget labels */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Live Dashboard Widget Labels</h2>
              <FieldEditor label="Dashboard label"   fieldKey="dash_label" enValue={formData.en?.dashboard?.label}        arValue={formData.ar?.dashboard?.label}        onChange={(lang, val) => updateDashField(lang, "label",        val)} />
              <FieldEditor label="Last updated text" fieldKey="dash_last"  enValue={formData.en?.dashboard?.last_updated} arValue={formData.ar?.dashboard?.last_updated} onChange={(lang, val) => updateDashField(lang, "last_updated", val)} />
              <FieldEditor label="Just now text"     fieldKey="dash_now"   enValue={formData.en?.dashboard?.just_now}     arValue={formData.ar?.dashboard?.just_now}     onChange={(lang, val) => updateDashField(lang, "just_now",     val)} />
              <FieldEditor label="Sync status label" fieldKey="dash_sync"  enValue={formData.en?.dashboard?.sync_label}   arValue={formData.ar?.dashboard?.sync_label}   onChange={(lang, val) => updateDashField(lang, "sync_label",   val)} />
            </section>

            {/* Dashboard metric items */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Dashboard Metric Items (5 fixed)</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Label and value are now both independent per language — use Arabic numerals / formatting in AR (e.g. <span className="font-mono">+٥٦٠</span>).
                  Icon is shared (decorative only).
                </p>
              </div>

              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Item {i + 1}</span>

                  {/* Label — translated */}
                  <FieldEditor
                    label="Label"
                    fieldKey={"dash_item_label_" + i}
                    enValue={enItems[i]?.label}
                    arValue={arItems[i]?.label}
                    onChange={(lang, val) => updateDashItem(lang, i, "label", val)}
                  />

                  {/* Value — now per-lang */}
                  <FieldEditor
                    label="Value"
                    fieldKey={"dash_item_val_" + i}
                    enValue={enItems[i]?.val}
                    arValue={arItems[i]?.val}
                    onChange={(lang, val) => updateDashItem(lang, i, "val", val)}
                  />

                  {/* Icon — shared */}
                  <IconPicker
                    label="Icon (shared)"
                    value={enItems[i]?.icon}
                    onChange={(val) => updateIcon(i, val)}
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
