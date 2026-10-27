export type AcademicYearRange = {
  label: string;
  startYear: number;
  endYear: number;
  start: Date;
  end: Date;
};

export function getCurrentAcademicYearLabel(date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const startYear = month >= 8 ? year : year - 1;

  return `${startYear}/${startYear + 1}`;
}

export function parseAcademicYear(value: string | null, date = new Date()): AcademicYearRange {
  const normalizedValue = (value ?? getCurrentAcademicYearLabel(date)).trim();

  const academicYearMatch = /^\s*(\d{4})\s*\/\s*(\d{4})\s*$/.exec(normalizedValue);

  if (academicYearMatch) {
    const startYear = Number(academicYearMatch[1]);
    const endYear = Number(academicYearMatch[2]);

    if (endYear !== startYear + 1) {
      throw new Error("Academic year must be in the format YYYY/YYYY");
    }

    return {
      label: `${startYear}/${endYear}`,
      startYear,
      endYear,
      start: new Date(Date.UTC(startYear, 8, 1, 0, 0, 0, 0)),
      end: new Date(Date.UTC(endYear, 8, 1, 0, 0, 0, 0)),
    };
  }

  const singleYearMatch = /^\s*(\d{4})\s*$/.exec(normalizedValue);

  if (singleYearMatch) {
    const startYear = Number(singleYearMatch[1]);
    const endYear = startYear + 1;

    return {
      label: `${startYear}/${endYear}`,
      startYear,
      endYear,
      start: new Date(Date.UTC(startYear, 8, 1, 0, 0, 0, 0)),
      end: new Date(Date.UTC(endYear, 8, 1, 0, 0, 0, 0)),
    };
  }

  throw new Error("Invalid academic year");
}

export function getAcademicYearLabelFromDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const startYear = month >= 8 ? year : year - 1;

  return `${startYear}/${startYear + 1}`;
}
