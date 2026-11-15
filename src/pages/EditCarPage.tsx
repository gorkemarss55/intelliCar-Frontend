import React from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '@/components/shared/Container'
import { PageHeader } from '@/components/shared/PageHeader'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { useCurrentUser } from '@/features/auth/store'
import { CarEditForm } from '@/features/cars/components/CarEditForm'
import { useCar } from '@/features/cars/hooks'
import { carTitle } from '@/features/cars/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function EditCarPage() {
  useDocumentTitle('İlanı düzenle')
  const { id } = useParams()
  const user = useCurrentUser()
  const { data: car, isLoading, isError, error, refetch } = useCar(id)

  const isOwner = React.useMemo(() => {
    if (!car || !user) return false
    return car.seller?.id === user.id
  }, [car, user])

  return (
    <Container className="max-w-4xl py-8">
      {isLoading ? (
        <Spinner />
      ) : isError || !car ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : !isOwner ? (
        <ErrorState error={new Error('Bu ilanı düzenleme yetkin yok.')} />
      ) : (
        <>
          <PageHeader title={`${carTitle(car)} ilanını düzenle`} />
          <CarEditForm car={car} />
        </>
      )}
    </Container>
  )
}