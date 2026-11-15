import { useMutation } from '@tanstack/react-query'
import { filesApi } from './api'

export const useUploadImages = () => useMutation({ mutationFn: filesApi.upload })
