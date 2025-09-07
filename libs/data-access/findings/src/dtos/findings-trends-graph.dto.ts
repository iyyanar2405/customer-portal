export interface FindingsTrendsGraphDto {
  data: {
    categories: FindingCategoryDto[];
  };
}

export interface FindingCategoryDto {
  categoryName: string;
  findings: FindingsCountDto[];
}

export interface FindingsCountDto {
  year: number;
  count: number;
}
