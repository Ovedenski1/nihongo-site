"use client";

function parseDateForBadge(dateStr: string) {
  const d = new Date(dateStr);

  if (Number.isNaN(d.getTime())) {
    return { day: "??", monthShort: "???", kana: "" };
  }

  const day = String(d.getDate());

  // ✅ Bulgarian month short (consistent)
  const monthMap: Record<number, string> = {
    0: "ЯНУ",
    1: "ФЕВ",
    2: "МАР",
    3: "АПР",
    4: "МАЙ",
    5: "ЮНИ",
    6: "ЮЛИ",
    7: "АВГ",
    8: "СЕП",
    9: "ОКТ",
    10: "НОЕ",
    11: "ДЕК",
  };

  const monthShort = monthMap[d.getMonth()] ?? "???";

  const kanaMap: Record<number, string> = {
    1: "いち",
    2: "に",
    3: "さん",
    4: "よん",
    5: "ご",
    6: "ろく",
    7: "なな",
    8: "はち",
    9: "きゅう",
    10: "じゅう",
    11: "じゅういち",
    12: "じゅうに",
    13: "じゅうさん",
    14: "じゅうよん",
    15: "じゅうご",
    16: "じゅうろく",
    17: "じゅうなな",
    18: "じゅうはち",
    19: "じゅうきゅう",
    20: "にじゅう",
    21: "にじゅういち",
    22: "にじゅうに",
    23: "にじゅうさん",
    24: "にじゅうよん",
    25: "にじゅうご",
    26: "にじゅうろく",
    27: "にじゅうなな",
    28: "にじゅうはち",
    29: "にじゅうきゅう",
    30: "さんじゅう",
    31: "さんじゅういち",
  };

  const kana = kanaMap[d.getDate()] ?? "";
  return { day, monthShort, kana };
}

// split kana into 2 “lines” after 5 chars (ignores spaces)
function splitKana(kana: string) {
  const chars = Array.from(kana.replace(/\s+/g, ""));
  const first = chars.slice(0, 5).join("");
  const second = chars.slice(5).join("");
  return { first, second };
}

export default function DateBadge({ dateStr }: { dateStr: string }) {
  const { day, monthShort, kana } = parseDateForBadge(dateStr);
  const { first, second } = splitKana(kana);

  return (
    <div aria-label={`Date ${dateStr}`} className="flex items-start gap-3">
      {/* LEFT: day + month */}
      <div className="flex flex-col items-start leading-none">
        <span className="font-serif font-extrabold leading-none text-[64px] md:text-[72px] text-[var(--kizuna-yellow)]">
          {day}
        </span>

        <span className="mt-1 text-[12px] font-semibold tracking-widest text-black/60">
          {monthShort}
        </span>
      </div>

      {/* RIGHT: kana vertical */}
      {!!kana && (
        <div className="pt-[6px] flex gap-[8px]">
          <span
            className="font-serif font-bold text-[14px] md:text-[15px] text-[var(--kizuna-yellow)] opacity-90"
            style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
          >
            {first}
          </span>

          {!!second && (
            <span
              className="font-serif font-bold text-[14px] md:text-[15px] text-[var(--kizuna-yellow)] opacity-90"
              style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
            >
              {second}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
