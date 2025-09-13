export interface NotificationListDto {
  currentPage: number;
  items: NotificationsDto[];
  totalItems: number;
  totalPages: number;
}

export interface NotificationsDto {
  createdTime: string;
  infoId: number;
  message: string;
  notificationCategory: string;
  readStatus: boolean;
  subject: string;
  entityType: string;
  entityId: string;
  language: string;
  snowLink: string;
}
