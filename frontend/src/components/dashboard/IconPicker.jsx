"use client";

import * as FaIcons from "react-icons/fa";

// Text input for choosing a react-icons/fa icon by name, with a live preview.
// Value is a shared (non-translated) field — same icon renders for both EN and AR.
export default function IconPicker({
  value,
  onChange,
  label = "Icon",
  helperNote = "shared",
  placeholder = "e.g. FaLeaf",
}) {
  const iconName  = value || "";
  const Preview   = iconName ? FaIcons[iconName] : null;
  const isInvalid = Boolean(iconName) && !Preview;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {helperNote && <span className="text-gray-400 font-normal">({helperNote})</span>}
      </label>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gray-50 border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
          {Preview ? (
            <Preview className="text-xl text-[#037338]" />
          ) : (
            <FaIcons.FaQuestion className="text-lg text-gray-300" />
          )}
        </div>
        <input
          type="text"
          value={iconName}
          onChange={(e) => onChange(e.target.value.trim())}
          placeholder={placeholder}
          className={`flex-1 px-4 py-2.5 bg-gray-50 border-2 rounded-xl text-sm focus:outline-none focus:bg-white transition-all ${
            isInvalid ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-[#037338]"
          }`}
        />
      </div>
      {isInvalid ? (
        <p className="text-xs text-red-500 mt-1.5">
          &quot;{iconName}&quot; isn&apos;t a valid icon name — a placeholder icon will show on the site until this is fixed.
        </p>
      ) : (
        <p className="text-xs text-gray-400 mt-1.5">
          Type the exact name of any icon from the{" "}
          <a
            href="https://react-icons.github.io/react-icons/icons/fa/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#037338] underline"
          >
            react-icons FontAwesome set
          </a>
          {" "}— it must start with &quot;Fa&quot; and match the capitalization exactly, e.g.{" "}
          <code className="bg-gray-100 px-1 rounded">FaLeaf</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">FaFlask</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">FaUsers</code>. Leave blank to use the default icon.
        </p>
      )}
    </div>
  );
}
