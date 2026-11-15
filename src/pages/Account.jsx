import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api, errMsg } from '../api'
import { Badge, Empty, Field, FUEL, Pager, Select, Spinner, statusTone, STATUS, Title, tl, TRANS } from '../ui'

const NEW = { brand: '', model: '', year: 2020, mileage: 0, price: '', fuelType: 'GASOLINE', transmission: 'MANUAL', city: '', description: '' }
const MAX_FILES = 10
const MAX_MB = 10

function CarForm({ onDone }) {
  const [f, setF] = useState(NEW); const [files, setFiles] = useState([]); const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  // Seçilen dosyaların önizleme adresleri; dosya listesi değişince eskiler serbest bırakılır.
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files])
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews])

  const pick = (e) => {
    const picked = Array.from(e.target.files || [])
    e.target.value = ''
    const valid = picked.filter((file) => {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) { toast.error(`${file.name}: yalnızca JPG, PNG, WEBP veya GIF yüklenebilir`); return false }
      if (file.size > MAX_MB * 1024 * 1024) { toast.error(`${file.name}: en fazla ${MAX_MB} MB olabilir`); return false }
      return true
    })
    setFiles((prev) => {
      const next = [...prev, ...valid]
      if (next.length > MAX_FILES) toast.error(`En fazla ${MAX_FILES} görsel eklenebilir`)
      return next.slice(0, MAX_FILES)
    })
  }
  const remove = (i) => setFiles(files.filter((_, j) => j !== i))

  const submit = async (e) => {
    e.preventDefault(); setBusy(true)
    try {
      const urls = []
      for (const file of files) urls.push(await api.upload(file))
      const images = urls.map((imageUrl, i) => ({ imageUrl, isPrimary: i === 0 }))
      await api.createCar({ ...f, year: +f.year, mileage: +f.mileage, price: +f.price, images })
      toast.success('İlanın yayınlandı'); setF(NEW); setFiles([]); onDone()
    } catch (x) { toast.error(errMsg(x)) } finally { setBusy(false) }
  }
  return (
    <form onSubmit={submit} className="card mb-8 grid gap-3 p-5 md:grid-cols-4">
      <Field label="Marka"><input required className="input" value={f.brand} onChange={set('brand')} /></Field>
      <Field label="Model"><input required className="input" value={f.model} onChange={set('model')} /></Field>
      <Field label="Yıl"><input type="number" min="1900" required className="input" value={f.year} onChange={set('year')} /></Field>
      <Field label="Kilometre"><input type="number" min="0" required className="input" value={f.mileage} onChange={set('mileage')} /></Field>
      <Field label="Fiyat (TL)"><input type="number" min="1" required className="input" value={f.price} onChange={set('price')} /></Field>
      <Field label="Yakıt"><Select value={f.fuelType} onChange={(v) => setF({ ...f, fuelType: v })} options={FUEL} /></Field>
      <Field label="Vites"><Select value={f.transmission} onChange={(v) => setF({ ...f, transmission: v })} options={TRANS} /></Field>
      <Field label="Şehir"><input required className="input" value={f.city} onChange={set('city')} /></Field>
      <div className="md:col-span-2"><Field label="Açıklama"><textarea required rows="3" className="input" value={f.description} onChange={set('description')} /></Field></div>
      <div className="md:col-span-2">
        <Field label={`Görseller (en fazla ${MAX_FILES}, ilki ana görsel)`}>
          <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="input" onChange={pick} />
        </Field>
        {!!files.length && <div className="mt-3 flex flex-wrap gap-2">{files.map((file, i) => (
          <div key={previews[i]} className="relative h-16 w-24 overflow-hidden rounded-md border border-slate-200">
            <img src={previews[i]} alt="" className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute bottom-0 left-0 bg-brand px-1.5 text-[10px] font-semibold text-white">Ana</span>}
            <button type="button" onClick={() => remove(i)} aria-label="Görseli kaldır" className="absolute right-0 top-0 bg-white/90 px-1.5 text-xs font-bold text-rose-600">×</button>
          </div>))}</div>}
      </div>
      <div className="md:col-span-4"><button className="btn" disabled={busy}>{busy ? 'Yükleniyor…' : 'İlanı yayınla'}</button></div>
    </form>
  )
}

function Offers({ carId }) {
  const [page, setPage] = useState(null)
  const load = useCallback(() => api.carOffers(carId, { size: 20, sort: 'createdAt,desc' }).then(setPage).catch((e) => toast.error(errMsg(e))), [carId])
  useEffect(() => { load() }, [load])
  const respond = async (id, s) => { try { await api.respondOffer(id, s); toast.success(s === 'ACCEPTED' ? 'Teklif kabul edildi' : 'Teklif reddedildi'); load() } catch (x) { toast.error(errMsg(x)) } }
  if (!page) return <Spinner />
  if (!page.content.length) return <p className="text-sm text-steel">Bu ilana henüz teklif gelmedi.</p>
  return <ul className="divide-y divide-slate-100">{page.content.map((o) => (
    <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
      <div><p className="font-bold">{tl(o.offeredPrice)} <Badge tone={statusTone(o.status)}>{STATUS[o.status]}</Badge></p>
        <p className="text-steel">{o.buyer?.firstName} {o.buyer?.lastName} · {o.buyer?.phone}{o.note && ` · “${o.note}”`}</p></div>
      {o.status === 'PENDING' && <div className="flex gap-2"><button className="btn !py-1.5" onClick={() => respond(o.id, 'ACCEPTED')}>Kabul et</button><button className="btn-ghost !py-1.5" onClick={() => respond(o.id, 'REJECTED')}>Reddet</button></div>}
    </li>))}</ul>
}

function CarRow({ car, reload }) {
  const [open, setOpen] = useState(false); const [edit, setEdit] = useState(false)
  const [f, setF] = useState({ price: car.price, mileage: car.mileage, description: '', status: car.status })
  const save = async () => {
    try { const d = await api.car(car.id); await api.updateCar(car.id, { price: +f.price, mileage: +f.mileage, status: f.status, description: f.description || d.description }); toast.success('İlan güncellendi'); setEdit(false); reload() }
    catch (x) { toast.error(errMsg(x)) }
  }
  const del = async () => { if (!confirm('İlan yayından kaldırılsın mı?')) return; try { await api.deleteCar(car.id); toast.success('İlan kaldırıldı'); reload() } catch (x) { toast.error(errMsg(x)) } }
  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="h-16 w-24 overflow-hidden rounded-md bg-slate-100">{car.primaryImageUrl && <img src={car.primaryImageUrl} alt="" className="h-full w-full object-cover" />}</div>
        <div className="min-w-0 flex-1"><Link to={`/ilan/${car.id}`} className="font-bold hover:text-brand">{car.brand} {car.model} · {car.year}</Link><p className="text-sm text-steel">{tl(car.price)} · {car.mileage.toLocaleString('tr-TR')} km</p></div>
        <Badge tone={statusTone(car.status)}>{STATUS[car.status]}</Badge>
        <button className="btn-ghost !py-1.5" onClick={() => setOpen(!open)}>Teklifler</button>
        <button className="btn-ghost !py-1.5" onClick={() => setEdit(!edit)}>Düzenle</button>
        <button className="btn-ghost !py-1.5 !text-rose-600" onClick={del}>Kaldır</button>
      </div>
      {edit && <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-4">
        <Field label="Fiyat"><input type="number" className="input" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></Field>
        <Field label="Kilometre"><input type="number" className="input" value={f.mileage} onChange={(e) => setF({ ...f, mileage: e.target.value })} /></Field>
        <Field label="Durum"><Select value={f.status} onChange={(v) => setF({ ...f, status: v })} options={{ ACTIVE: 'Yayında', SOLD: 'Satıldı', INACTIVE: 'Pasif' }} /></Field>
        <Field label="Yeni açıklama (boşsa değişmez)"><input className="input" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <div className="md:col-span-4"><button className="btn" onClick={save}>Kaydet</button></div></div>}
      {open && <div className="mt-4 border-t border-slate-100 pt-4"><Offers carId={car.id} /></div>}
    </div>
  )
}

export function MyCars() {
  const [pageNo, setPageNo] = useState(0); const [data, setData] = useState(null); const [show, setShow] = useState(false)
  const load = useCallback(() => api.myCars({ page: pageNo, size: 10, sort: 'createdAt,desc' }).then(setData).catch((e) => toast.error(errMsg(e))), [pageNo])
  useEffect(() => { load() }, [load])
  return (<>
    <div className="flex items-start justify-between"><Title sub="İlanlarını ve gelen teklifleri buradan yönet.">İlanlarım</Title><button className="btn" onClick={() => setShow(!show)}>{show ? 'Vazgeç' : 'Yeni ilan'}</button></div>
    {show && <CarForm onDone={() => { setShow(false); load() }} />}
    {!data ? <Spinner /> : !data.content.length ? <Empty>Henüz ilanın yok. “Yeni ilan” ile ilk aracını yayınla.</Empty> :
      <div className="space-y-3">{data.content.map((c) => <CarRow key={c.id} car={c} reload={load} />)}</div>}
    <Pager page={data} onChange={setPageNo} />
  </>)
}

export function MyOffers() {
  const [pageNo, setPageNo] = useState(0); const [data, setData] = useState(null)
  useEffect(() => { api.myOffers({ page: pageNo, size: 10, sort: 'createdAt,desc' }).then(setData).catch((e) => toast.error(errMsg(e))) }, [pageNo])
  return (<>
    <Title sub="Verdiğin tekliflerin durumu.">Tekliflerim</Title>
    {!data ? <Spinner /> : !data.content.length ? <Empty>Henüz teklif vermedin. <Link to="/" className="font-semibold text-brand">İlanlara göz at</Link></Empty> :
      <div className="space-y-3">{data.content.map((o) => (
        <div key={o.id} className="card flex flex-wrap items-center justify-between gap-2 p-4">
          <div><Link to={`/ilan/${o.carId}`} className="font-bold hover:text-brand">{o.carTitle}</Link>
            <p className="text-sm text-steel">Teklifin: {tl(o.offeredPrice)}{o.note && ` · “${o.note}”`}</p></div>
          <Badge tone={statusTone(o.status)}>{STATUS[o.status]}</Badge>
        </div>))}</div>}
    <Pager page={data} onChange={setPageNo} />
  </>)
}
