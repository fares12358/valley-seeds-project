"use client";

/**
 * FieldEditor — atomic EN + AR field pair
 * Desktop: two columns side by side (EN left | AR right)
 * Mobile:  stacked (EN top | AR bottom)
 *
 * AR input always has dir="rtl" regardless of page direction.
 * Warning dot appears when one side is filled but the other is empty.
 */

export default function FieldEditor({
  label,
  fieldKey,
  enValue = "",
  arValue = "",
  onChange,
  multiline = false,
  required = false,
  maxLength,
  placeholder = {},
}) {
  const enEmpty = !enValue?.trim();
  const arEmpty = !arValue?.trim();
  const enWarn = !enEmpty && arEmpty;
  const arWarn = !arEmpty && enEmpty;

  const inputClass =
    "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 " +
    "focus:outline-none focus:border-[#037338] focus:bg-white focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] " +
    "transition-all duration-200 resize-none font-[Alexandria,sans-serif]";

  const renderInput = (lang, value, dir, warn) => {
    const id = fieldKey + "_" + lang;
    const ph = placeholder[lang] || (lang === "en" ? "English..." : "بالعربية...");
    const props = {
      id,
      name: id,
      value: value || "",
      dir,
      lang,
      maxLength,
      placeholder: ph,
      className: inputClass + (warn ? " border-amber-300" : ""),
      onChange: (e) => onChange?.(lang, e.target.value),
    };
    return multiline
      ? <textarea {...props} rows={4} />
      : <input type="text" {...props} />;
  };

  return (
    <div className="space-y-1.5">
      {/* Label row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <label htmlFor={fieldKey + "_en"} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
          {enWarn && (
            <span className="inline-block ml-1.5 w-2 h-2 rounded-full bg-amber-400" title="Arabic translation missing" />
          )}
          <span className="ml-1 text-[10px] text-gray-400 font-normal">EN</span>
        </label>
        <label htmlFor={fieldKey + "_ar"} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
          {arWarn && (
            <span className="inline-block ml-1.5 w-2 h-2 rounded-full bg-amber-400" title="English translation missing" />
          )}
          <span className="ml-1 text-[10px] text-gray-400 font-normal">AR</span>
        </label>
      </div>

      {/* Input row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {renderInput("en", enValue, "ltr", enWarn)}
        {renderInput("ar", arValue, "rtl", arWarn)}
      </div>

      {/* Character counter */}
      {maxLength && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <span className="text-[11px] text-gray-400 text-right">
            {(enValue || "").length}/{maxLength}
          </span>
          <span className="text-[11px] text-gray-400 text-left" dir="rtl">
            {(arValue || "").length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}
