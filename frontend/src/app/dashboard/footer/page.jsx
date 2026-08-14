"use client";

import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

export default function FooterEditorPage() {
  const { data, loading, error, save } = useSection("footer");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField, setImages }) => {
        const enLinks    = formData.en?.links || [];
        const arLinks    = formData.ar?.links || [];
        const enServices = formData.en?.services || [];
        const arServices = formData.ar?.services || [];
        const enContact  = formData.en?.contact_items || [];
        const arContact  = formData.ar?.contact_items || [];

        const updateLink = (lang, i, key, val) => {
          const arr = [...(formData[lang]?.links || [])];
          arr[i] = { ...arr[i], [key]: val };
          setField(lang, "links", arr);
        };
        const updateService = (lang, i, val) => {
          const arr = [...(formData[lang]?.services || [])];
          arr[i] = val;
          setField(lang, "services", arr);
        };
        const updateContactItem = (lang, i, key, val) => {
          const arr = [...(formData[lang]?.contact_items || [])];
          arr[i] = { ...arr[i], [key]: val };
          setField(lang, "contact_items", arr);
        };

        return (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Footer Text</h2>
              <FieldEditor label="Tagline" fieldKey="tagline" enValue={formData.en?.tagline} arValue={formData.ar?.tagline} onChange={(lang, val) => setField(lang, "tagline", val)} multiline required />
              <FieldEditor label="Quick Links column title" fieldKey="quick_links_title" enValue={formData.en?.quick_links_title} arValue={formData.ar?.quick_links_title} onChange={(lang, val) => setField(lang, "quick_links_title", val)} />
              <FieldEditor label="Services column title" fieldKey="services_title" enValue={formData.en?.services_title} arValue={formData.ar?.services_title} onChange={(lang, val) => setField(lang, "services_title", val)} />
              <FieldEditor label="Contact column title" fieldKey="contact_title" enValue={formData.en?.contact_title} arValue={formData.ar?.contact_title} onChange={(lang, val) => setField(lang, "contact_title", val)} />
              <FieldEditor label="Copyright line" fieldKey="copyright" enValue={formData.en?.copyright} arValue={formData.ar?.copyright} onChange={(lang, val) => setField(lang, "copyright", val)} />
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Quick Links (5 fixed)</h2>
              {enLinks.map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Link {i + 1}</span>
                  <FieldEditor label="Label" fieldKey={"link_label_"+i} enValue={enLinks[i]?.label} arValue={arLinks[i]?.label} onChange={(lang, val) => updateLink(lang, i, "label", val)} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Href <span className="text-gray-400 font-normal">(shared)</span></label>
                    <input type="text" value={enLinks[i]?.href||""} onChange={(e) => { updateLink("en",i,"href",e.target.value); updateLink("ar",i,"href",e.target.value); }} placeholder="#about" className="w-full max-w-xs px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#037338] focus:bg-white transition-all" />
                  </div>
                </div>
              ))}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Services List (5 items)</h2>
              {enServices.map((_, i) => (
                <FieldEditor key={i} label={"Service " + (i + 1)} fieldKey={"service_"+i} enValue={enServices[i]} arValue={arServices[i]} onChange={(lang, val) => updateService(lang, i, val)} />
              ))}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Contact Info (3 items)</h2>
              {enContact.map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">{item.key}</span>
                  <FieldEditor label="Label" fieldKey={"footer_contact_label_"+i} enValue={enContact[i]?.label} arValue={arContact[i]?.label} onChange={(lang, val) => updateContactItem(lang, i, "label", val)} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value <span className="text-gray-400 font-normal">(shared)</span></label>
                    <input type="text" value={enContact[i]?.value||""} onChange={(e) => { updateContactItem("en",i,"value",e.target.value); updateContactItem("ar",i,"value",e.target.value); }} placeholder="e.g. Cairo, Egypt" className="w-full max-w-sm px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#037338] focus:bg-white transition-all" />
                  </div>
                </div>
              ))}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-800">Logo Images</h2>
              <p className="text-sm text-gray-400">Upload both light and dark background versions.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageManager label="Logo — light background" value={formData.images?.[0]||null} folder="brand" onChange={(img) => { const imgs=[...(formData.images||[null,null])]; imgs[0]=img; setImages(imgs); }} />
                <ImageManager label="Logo — dark background (white)" value={formData.images?.[1]||null} folder="brand" onChange={(img) => { const imgs=[...(formData.images||[null,null])]; imgs[1]=img; setImages(imgs); }} />
              </div>
            </section>
          </div>
        );
      }}
    </SectionForm>
  );
}
