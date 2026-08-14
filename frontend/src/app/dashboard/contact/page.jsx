"use client";

import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

export default function ContactEditorPage() {
  const { data, loading, error, save } = useSection("contact");

  if (loading) return <SectionSkeleton rows={4} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField }) => {
        const setFormField = (lang, key, val) =>
          setField(lang, "form", { ...formData[lang]?.form, [key]: val });
        const setSuccessField = (lang, key, val) =>
          setField(lang, "success", { ...formData[lang]?.success, [key]: val });
        const updateInfoCard = (lang, i, key, val) => {
          const arr = [...(formData[lang]?.info || [])];
          arr[i] = { ...arr[i], [key]: val };
          setField(lang, "info", arr);
        };
        const updateSubjectOption = (lang, i, key, val) => {
          const arr = [...(formData[lang]?.form?.subject_options || [])];
          arr[i] = { ...arr[i], [key]: val };
          setField(lang, "form", { ...formData[lang]?.form, subject_options: arr });
        };

        const enInfo = formData.en?.info || [];
        const arInfo = formData.ar?.info || [];
        const enOpts = formData.en?.form?.subject_options || [];
        const arOpts = formData.ar?.form?.subject_options || [];

        return (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Section Header</h2>
              <FieldEditor label="Eyebrow" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
              <FieldEditor label="Heading line 1" fieldKey="heading_line1" enValue={formData.en?.heading_line1} arValue={formData.ar?.heading_line1} onChange={(lang, val) => setField(lang, "heading_line1", val)} required />
              <FieldEditor label="Heading line 2" fieldKey="heading_line2" enValue={formData.en?.heading_line2} arValue={formData.ar?.heading_line2} onChange={(lang, val) => setField(lang, "heading_line2", val)} />
              <FieldEditor label="Subheading" fieldKey="subheading" enValue={formData.en?.subheading} arValue={formData.ar?.subheading} onChange={(lang, val) => setField(lang, "subheading", val)} multiline />
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Form Labels & Placeholders</h2>
              {[
                ["Form title","title"],["Form subtitle","subtitle"],
                ["Name label","name_label"],["Name placeholder","name_placeholder"],
                ["Email label","email_label"],["Email placeholder","email_placeholder"],
                ["Phone label","phone_label"],["Phone placeholder","phone_placeholder"],
                ["Subject label","subject_label"],["Subject placeholder","subject_placeholder"],
                ["Message label","message_label"],["Message placeholder","message_placeholder"],
                ["Submit button","submit"],["Validation error","error"],
              ].map(([label, key]) => (
                <FieldEditor key={key} label={label} fieldKey={"form_" + key} enValue={formData.en?.form?.[key]} arValue={formData.ar?.form?.[key]} onChange={(lang, val) => setFormField(lang, key, val)} multiline={key === "message_placeholder"} />
              ))}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Subject Options (4 fixed)</h2>
              {[0,1,2,3].map((i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Option {i + 1}</span>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value <span className="text-gray-400 font-normal">(shared)</span></label>
                    <input type="text" value={enOpts[i]?.value || ""} onChange={(e) => { updateSubjectOption("en",i,"value",e.target.value); updateSubjectOption("ar",i,"value",e.target.value); }} placeholder="e.g. general" className="w-full max-w-xs px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#037338] focus:bg-white transition-all" />
                  </div>
                  <FieldEditor label="Label" fieldKey={"opt_label_"+i} enValue={enOpts[i]?.label} arValue={arOpts[i]?.label} onChange={(lang,val) => updateSubjectOption(lang,i,"label",val)} />
                </div>
              ))}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Success State</h2>
              <FieldEditor label="Success heading" fieldKey="success_heading" enValue={formData.en?.success?.heading} arValue={formData.ar?.success?.heading} onChange={(lang,val) => setSuccessField(lang,"heading",val)} />
              <FieldEditor label="Success body" fieldKey="success_body" enValue={formData.en?.success?.body} arValue={formData.ar?.success?.body} onChange={(lang,val) => setSuccessField(lang,"body",val)} multiline />
              <FieldEditor label="Send another link" fieldKey="success_again" enValue={formData.en?.success?.again} arValue={formData.ar?.success?.again} onChange={(lang,val) => setSuccessField(lang,"again",val)} />
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Contact Info Cards (4 fixed)</h2>
              {enInfo.map((card, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">{card.key}</span>
                  <FieldEditor label="Card label" fieldKey={"info_label_"+i} enValue={enInfo[i]?.label} arValue={arInfo[i]?.label} onChange={(lang,val) => updateInfoCard(lang,i,"label",val)} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value & Link <span className="text-gray-400 font-normal">(shared)</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" value={enInfo[i]?.value||""} onChange={(e) => { updateInfoCard("en",i,"value",e.target.value); updateInfoCard("ar",i,"value",e.target.value); }} placeholder="Display value" className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#037338] focus:bg-white transition-all" />
                      <input type="text" value={enInfo[i]?.link||""} onChange={(e) => { updateInfoCard("en",i,"link",e.target.value); updateInfoCard("ar",i,"link",e.target.value); }} placeholder="tel:, mailto:, https://..." className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#037338] focus:bg-white transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        );
      }}
    </SectionForm>
  );
}
