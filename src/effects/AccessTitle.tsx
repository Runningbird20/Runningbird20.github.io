// A tiny local 5×7 bitmap alphabet keeps the title crisp without a font download.
const pixels: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  G: ["01111", "10000", "10000", "10111", "10001", "10001", "01111"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  N: ["10001", "11001", "11001", "10101", "10011", "10011", "10001"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
};
function PixelLetters({ primary = false }: { primary?: boolean }) {
  return (
    <>
      {Array.from("ACCESS GRANTED").map((letter, index) => (
        <span
          key={index}
          className={primary ? "access-glyph" : "access-echo-glyph"}
          data-character={letter}
        >
          <svg viewBox="0 0 5 7" aria-hidden="true" shapeRendering="crispEdges">
            {(pixels[letter] || []).flatMap((row, y) =>
              Array.from(row).map((pixel, x) =>
                pixel === "1" ? (
                  <rect
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    width="1"
                    height="1"
                    fill="currentColor"
                  />
                ) : null,
              ),
            )}
          </svg>
        </span>
      ))}
    </>
  );
}
export function AccessTitle() {
  return (
    <div className="access-stage" aria-hidden="true">
      <h2 className="access-title">
        <span className="sr-only">ACCESS GRANTED</span>
        <span className="access-pixels">
          <PixelLetters primary />
        </span>
        <span className="access-echo echo-cyan">
          <PixelLetters />
        </span>
        <span className="access-echo echo-magenta">
          <PixelLetters />
        </span>
      </h2>
      <div className="access-fragments">
        {Array.from({ length: 12 }, (_, i) => (
          <i
            key={i}
            style={{ left: `${12 + i * 6.6}%`, top: `${35 + (i % 4) * 9}%` }}
          />
        ))}
      </div>
    </div>
  );
}
