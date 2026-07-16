export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  projectKey: string;
  jiraProjectId?: string;
  leadId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
}
