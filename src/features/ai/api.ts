import { http } from '@/lib/http'
import type { BudgetRecommendationRequest, BudgetRecommendationResponse, PriceEstimate, PriceEstimateRequest } from '@/types/api'

export const aiApi = {
  recommend: (body: BudgetRecommendationRequest) =>
    http.post<BudgetRecommendationResponse>('/ai/recommend', body, { timeout: 60_000 }).then((r) => r.data),
  estimate: (body: PriceEstimateRequest) => http.post<PriceEstimate>('/ai/price-estimate', body, { timeout: 60_000 }).then((r) => r.data),
}
