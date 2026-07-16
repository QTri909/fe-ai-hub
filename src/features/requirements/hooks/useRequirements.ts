import { useState, useEffect, useCallback } from 'react';
import { requirementApi } from '../api/requirements.api';
import type {
  Requirement,
  RequirementDetail,
  RequirementPage,
  GenerateTestCasesPayload,
  GenerateTestCasesResponse,
} from '../types/requirements.types';

/**
 * Hook: Lấy tất cả Requirements với phân trang
 * GET /api/v1/requirements?page=&size=
 */
export function useRequirements(page = 0, size = 10) {
  const [data, setData] = useState<RequirementPage | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await requirementApi.getAll(page, size);
      setData(result);
      setRequirements(result.content);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch requirements'));
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, requirements, isLoading, error, refetch: fetch };
}

/**
 * Hook: Lấy Requirements theo Project
 * GET /api/v1/requirements/by-project/{projectId}?page=&size=
 */
export function useRequirementsByProject(projectId?: string, page = 0, size = 50) {
  const [data, setData] = useState<RequirementPage | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      setError(null);
      const result = await requirementApi.getByProjectId(projectId, page, size);
      setData(result);
      setRequirements(result.content);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch requirements by project'));
    } finally {
      setIsLoading(false);
    }
  }, [projectId, page, size]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, requirements, isLoading, error, refetch: fetch };
}

/**
 * Hook: Lấy chi tiết 1 Requirement
 * GET /api/v1/requirements/{id}
 */
export function useRequirement(id?: string) {
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const result = await requirementApi.getById(id);
      setRequirement(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch requirement'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { requirement, isLoading, error, refetch: fetch };
}

/**
 * Hook: Lấy Requirement Detail (kèm Acceptance Criteria + Test Case counts)
 * GET /api/v1/requirements/{id}/detail
 */
export function useRequirementDetail(id?: string) {
  const [detail, setDetail] = useState<RequirementDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const result = await requirementApi.getDetail(id);
      setDetail(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch requirement detail'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { detail, isLoading, error, refetch: fetch };
}

/**
 * Hook: Generate Test Cases từ AI
 * POST /api/v1/requirements/{id}/generate-test-cases
 */
export function useGenerateTestCases() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerateTestCasesResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const generate = useCallback(async (requirementId: string, payload: GenerateTestCasesPayload) => {
    try {
      setIsGenerating(true);
      setError(null);
      const response = await requirementApi.generateTestCases(requirementId, payload);
      setResult(response);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate test cases'));
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generate, isGenerating, result, error };
}
