
import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import './RecortadorImagen.css'

function RecortadorImagen({ imagen, tipo, alCancelar, alConfirmar }) {
  const [recorte, setRecorte] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [areaRecorte, setAreaRecorte] = useState(null)

  const alTerminarRecorte = useCallback((_, areaPixels) => {
    setAreaRecorte(areaPixels)
  }, [])

  async function crearImagenRecortada() {
    if (!areaRecorte) return

    const imagenOriginal = new Image()
    imagenOriginal.src = imagen

    await new Promise((resolver, rechazar) => {
      imagenOriginal.onload = resolver
      imagenOriginal.onerror = rechazar
    })

    const lienzo = document.createElement('canvas')
    const contexto = lienzo.getContext('2d')

    lienzo.width = areaRecorte.width
    lienzo.height = areaRecorte.height

    contexto.drawImage(
      imagenOriginal,
      areaRecorte.x,
      areaRecorte.y,
      areaRecorte.width,
      areaRecorte.height,
      0,
      0,
      areaRecorte.width,
      areaRecorte.height
    )

    alConfirmar(lienzo.toDataURL('image/jpeg', 0.9))
  }

  const esFoto = tipo === 'foto'

  return (
    <div className="fondo-recortador">
      <div className="modal-recortador">
        <h2>{esFoto ? 'Ajusta tu foto' : 'Ajusta tu portada'}</h2>
        <p>Mueve la imagen y ajusta el zoom a tu gusto.</p>

        <div className={`area-recortador ${esFoto ? 'recorte-circular' : 'recorte-portada'}`}>
          <Cropper
            image={imagen}
            crop={recorte}
            zoom={zoom}
            aspect={esFoto ? 1 : 16 / 5}
            cropShape={esFoto ? 'round' : 'rect'}
            showGrid={false}
            onCropChange={setRecorte}
            onZoomChange={setZoom}
            onCropComplete={alTerminarRecorte}
          />
        </div>

        <label className="etiqueta-zoom">Zoom</label>
        <input
          type="range"
          min="1"
          max="3"
          step="0.1"
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
        />

        <div className="acciones-recortador">
          <button type="button" onClick={alCancelar}>
            Cancelar
          </button>
          <button type="button" onClick={crearImagenRecortada}>
            Guardar imagen
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecortadorImagen
