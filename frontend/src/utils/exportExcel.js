/**
 * exportExcel.js
 * Zero-dependency Excel export using a plain XML SpreadsheetML (XLS) blob.
 * Opens natively in Excel and LibreOffice with full column formatting.
 */

/**
 * Escape XML special characters in cell values.
 */
function escapeXml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Build one <Row> of header cells.
 */
function buildHeaderRow(columns) {
  const cells = columns
    .map(
      (col) =>
        `<Cell ss:StyleID="header"><Data ss:Type="String">${escapeXml(col.label)}</Data></Cell>`
    )
    .join("");
  return `<Row>${cells}</Row>`;
}

/**
 * Build one <Row> of data cells.
 */
function buildDataRow(row, columns) {
  const cells = columns
    .map((col) => {
      const raw = col.accessor(row);
      const value = raw == null ? "" : String(raw);
      const type = typeof raw === "number" ? "Number" : "String";
      return `<Cell ss:StyleID="cell"><Data ss:Type="${type}">${escapeXml(value)}</Data></Cell>`;
    })
    .join("");
  return `<Row>${cells}</Row>`;
}

/**
 * Export an array of message objects to an .xls file (SpreadsheetML).
 *
 * @param {object[]} messages   — array from the messages context
 * @param {string}   filename   — without extension, e.g. "valley-seeds-leads"
 */
export function exportMessagesToExcel(messages, filename = "messages-export") {
  const columns = [
    { label: "Name",    accessor: (m) => m.name },
    { label: "Email",   accessor: (m) => m.email },
    { label: "Phone",   accessor: (m) => m.phone || "" },
    { label: "Subject", accessor: (m) => m.subject || "" },
    { label: "Message", accessor: (m) => m.message },
    { label: "Status",  accessor: (m) => (m.read ? "Read" : "Unread") },
    {
      label: "Date",
      accessor: (m) => {
        try {
          return new Date(m.createdAt).toLocaleString("en-EG", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Africa/Cairo",
          });
        } catch {
          return m.createdAt;
        }
      },
    },
  ];

  const headerRow = buildHeaderRow(columns);
  const dataRows  = messages.map((m) => buildDataRow(m, columns)).join("\n        ");

  const colWidths = [180, 220, 130, 200, 400, 80, 160];
  const colDefs   = colWidths.map((w) => `<Column ss:Width="${w}"/>`).join("\n        ");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook
  xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:x="urn:schemas-microsoft-com:office:excel">
  <Styles>
    <Style ss:ID="header">
      <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11"/>
      <Interior ss:Color="#037338" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="0"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#025c2e"/>
      </Borders>
    </Style>
    <Style ss:ID="cell">
      <Font ss:Size="10" ss:Color="#1a1a1a"/>
      <Alignment ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e5e7eb"/>
      </Borders>
    </Style>
  </Styles>
  <Worksheet ss:Name="Messages">
    <Table>
        ${colDefs}
        ${headerRow}
        ${dataRows}
    </Table>
    <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
      <FreezePanes/>
      <FrozenNoSplit/>
      <SplitHorizontal>1</SplitHorizontal>
      <TopRowBottomPane>1</TopRowBottomPane>
    </WorksheetOptions>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href    = url;
  a.download = `${filename}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Filter messages by a date range.
 *
 * @param {object[]}  messages
 * @param {Date|null} from   — start of range (inclusive), null = no lower bound
 * @param {Date|null} to     — end of range (inclusive), null = no upper bound
 */
export function filterByDateRange(messages, from, to) {
  return messages.filter((m) => {
    const d = new Date(m.createdAt);
    if (from && d < from) return false;
    if (to   && d > to)   return false;
    return true;
  });
}

/**
 * Return { from, to } Date objects for built-in quick ranges.
 *
 * @param {"alltime"|"today"|"7d"|"30d"|"90d"} range
 * @returns {{ from: Date|null, to: Date|null }}
 */
export function getQuickRangeDates(range) {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eod   = new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1); // end-of-day

  switch (range) {
    case "today":
      return { from: today, to: eod };
    case "7d":
      return { from: new Date(today.getTime() - 6  * 24 * 60 * 60 * 1000), to: eod };
    case "30d":
      return { from: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000), to: eod };
    case "90d":
      return { from: new Date(today.getTime() - 89 * 24 * 60 * 60 * 1000), to: eod };
    case "alltime":
    default:
      return { from: null, to: null };
  }
}
