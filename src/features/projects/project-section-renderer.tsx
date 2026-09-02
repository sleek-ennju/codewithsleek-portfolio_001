type Section = { id: string; type: string; title: string | null; content: unknown };

export function ProjectSectionRenderer({ sections }: { sections: Section[] }) {
  if (!sections.length) return null;
  return (
    <div className="case-study-sections container">
      {sections.map((section) => {
        const content = (
          section.content && typeof section.content === "object" ? section.content : {}
        ) as Record<string, unknown>;
        if (section.type === "QUOTE")
          return (
            <figure className="case-study-section case-study-quote" key={section.id}>
              {section.title && <p className="section-kicker">{section.title}</p>}
              <blockquote>{String(content.quote ?? "")}</blockquote>
              {Boolean(content.attribution) && (
                <figcaption>{String(content.attribution)}</figcaption>
              )}
            </figure>
          );
        if (section.type === "CODE_SAMPLE")
          return (
            <section className="case-study-section case-study-code" key={section.id}>
              {section.title && <p className="section-kicker">{section.title}</p>}
              <pre>
                <code data-language={String(content.language ?? "text")}>
                  {String(content.code ?? "")}
                </code>
              </pre>
            </section>
          );
        if (section.type === "TWO_COLUMN")
          return (
            <section className="case-study-section" key={section.id}>
              {section.title && <p className="section-kicker">{section.title}</p>}
              <div className="case-study-two-column">
                <p>{String(content.left ?? "")}</p>
                <p>{String(content.right ?? "")}</p>
              </div>
            </section>
          );
        if (section.type === "METRICS_GRID") {
          const metrics = Array.isArray(content.metrics)
            ? (content.metrics as Array<Record<string, unknown>>)
            : [];
          return (
            <section className="case-study-section" key={section.id}>
              {section.title && <p className="section-kicker">{section.title}</p>}
              <dl className="case-study-section-metrics">
                {metrics.map((metric, index) => (
                  <div key={`${metric.label}-${index}`}>
                    <dt>
                      <strong>{String(metric.value ?? "")}</strong>
                      {Boolean(metric.unit) && <small>{String(metric.unit)}</small>}
                    </dt>
                    <dd>{String(metric.label ?? "")}</dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        }
        return (
          <section className="case-study-section" key={section.id}>
            {section.title && <p className="section-kicker">{section.title}</p>}
            <p>{String(content.text ?? "")}</p>
          </section>
        );
      })}
    </div>
  );
}
