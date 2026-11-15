import type { CarStatus, OfferStatus } from '@/types/api'
import { CAR_STATUS_LABELS, OFFER_STATUS_LABELS } from '@/lib/constants'
import { Badge, type BadgeTone } from '@/components/ui/Badge'

const CAR_TONES: Record<CarStatus, BadgeTone> = { ACTIVE: 'green', PENDING_REVIEW: 'amber', SOLD: 'blue', INACTIVE: 'neutral' }
const OFFER_TONES: Record<OfferStatus, BadgeTone> = { PENDING: 'amber', ACCEPTED: 'green', REJECTED: 'red', EXPIRED: 'neutral' }

export const CarStatusBadge = ({ status }: { status: CarStatus }) => (
  <Badge tone={CAR_TONES[status]}>{CAR_STATUS_LABELS[status]}</Badge>
)
export const OfferStatusBadge = ({ status }: { status: OfferStatus }) => (
  <Badge tone={OFFER_TONES[status]}>{OFFER_STATUS_LABELS[status]}</Badge>
)
