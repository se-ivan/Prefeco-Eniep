/** Public aggregate contract, also used by the three source applications. */
export type ProjectId = "evaluacion-prefeco" | "examenes-prefeco" | "prefeco-eniep";
export type MetricUnit = "count" | "score5" | "percent";

export interface ProjectSummary {
  projectId: ProjectId;
  generatedAt: string;
  periodLabel: string;
  metrics: {
    id: string;
    label: string;
    value: number | null;
    unit: MetricUnit;
  }[];
  chart: {
    title: string;
    points: { label: string; value: number }[];
  };
}

const METRICS: Record<ProjectId, Record<string, MetricUnit>> = {
  "evaluacion-prefeco": {
    evaluations: "count", groups: "count", teachers: "count",
    teacherAverage: "score5", serviceAverage: "score5",
  },
  "examenes-prefeco": {
    students: "count", publishedExams: "count", completedScans: "count", omrSuccessRate: "percent",
  },
  "prefeco-eniep": {
    institutions: "count", registrations: "count", disciplines: "count", supportAssignments: "count",
  },
};

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 160;
}

/** Validate and reconstruct the allowlisted contract; never relay extra fields. */
export function parseProjectSummary(value: unknown, expectedId: ProjectId): ProjectSummary {
  if (!record(value) || value.projectId !== expectedId ||
      typeof value.generatedAt !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T/.test(value.generatedAt) ||
      !Number.isFinite(Date.parse(value.generatedAt)) || !text(value.periodLabel) ||
      !Array.isArray(value.metrics) || !record(value.chart) ||
      !text(value.chart.title) || !Array.isArray(value.chart.points) || value.chart.points.length > 120) {
    throw new Error("Invalid project summary");
  }

  const expected = METRICS[expectedId];
  const ids = new Set<string>();
  const metrics = value.metrics.map((metric): ProjectSummary["metrics"][number] => {
    if (!record(metric) || typeof metric.id !== "string" || !Object.hasOwn(expected, metric.id) ||
        ids.has(metric.id) || !text(metric.label) || metric.unit !== expected[metric.id]) {
      throw new Error("Invalid summary metric");
    }
    const unit = expected[metric.id];
    const number = metric.value;
    if (number === null ? unit === "count" :
        typeof number !== "number" || !Number.isFinite(number) || number < 0 ||
        (unit === "count" && !Number.isSafeInteger(number)) ||
        (unit === "score5" && (number < 1 || number > 5)) ||
        (unit === "percent" && number > 100)) {
      throw new Error("Invalid summary metric value");
    }
    ids.add(metric.id);
    return { id: metric.id, label: metric.label, value: number as number | null, unit };
  });
  if (ids.size !== Object.keys(expected).length) throw new Error("Incomplete project summary");

  const labels = new Set<string>();
  const points = value.chart.points.map((point): ProjectSummary["chart"]["points"][number] => {
    if (!record(point) || !text(point.label) || labels.has(point.label) ||
        typeof point.value !== "number" || !Number.isSafeInteger(point.value) || point.value < 0) {
      throw new Error("Invalid summary chart");
    }
    labels.add(point.label);
    return { label: point.label, value: point.value };
  });

  return {
    projectId: expectedId,
    generatedAt: value.generatedAt,
    periodLabel: value.periodLabel,
    metrics,
    chart: { title: value.chart.title, points },
  };
}

export function omrSuccessRate(completed: number, failed: number): number | null {
  const processed = completed + failed;
  return processed === 0 ? null : Math.round(completed / processed * 1000) / 10;
}

export function formatMetric(value: number | null, unit: MetricUnit): string {
  if (value === null) return "Sin datos";
  const number = new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: unit === "count" ? 0 : 2,
  }).format(value);
  return unit === "score5" ? `${number} / 5` : unit === "percent" ? `${number}%` : number;
}

export function formatSummaryDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City", dateStyle: "medium", timeStyle: "short",
  }).format(new Date(iso));
}
