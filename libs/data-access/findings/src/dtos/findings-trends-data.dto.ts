import { TreeNode } from 'primeng/api';

export interface FindingsTrendsDataDto {
  data: TreeNode[];
  isSuccess: boolean;
  message: string;
  errorCode: string;
}
