import { useMutation } from '@tanstack/react-query'
import { aiApi } from './api'

export const useRecommend = () => useMutation({ mutationFn: aiApi.recommend })
export const useEstimatePrice = () => useMutation({ mutationFn: aiApi.estimate })
