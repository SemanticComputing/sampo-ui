import React from 'react'
import {styled} from '@mui/material/styles'
import Button from '@mui/material/Button'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import Captions from "yet-another-react-lightbox/plugins/captions"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"
import "yet-another-react-lightbox/plugins/captions.css"

const ImgPreviewImage = styled('img')({
  border: '1px solid lightgray'
})

const ImageGallerySRL = props => {
  let {data} = props
  if (!Array.isArray(data)) {
    data = [data]
  }

  const [open, setOpen] = React.useState(false)

  const thumbnailsRef = React.useRef(null)

  function importAll(r) {
    const imageCache = {}
    r.keys().map(item => (imageCache[item.replace('./', '')] = r(item)))
    return imageCache
  }

  const images = data.map(item => {
    let tempUrl = item.url
    const absoluteUrlRegExp = /^(?:[a-z]+:)?\/\//i
    if (!absoluteUrlRegExp.test(item.url)) {
      const importedImages = importAll(require.context('../../img/', true, /\.(png|jpg)$/))
      if (importedImages[item.url] !== undefined) {
        tempUrl = importedImages[item.url].default
      }
    }
    return {
      src: tempUrl,
      thumbnail: tempUrl,
      description: item.description
    }
  })
  return (
    <>
      <Button aria-label='open larger image' onClick={() => setOpen(true)}>
        <ImgPreviewImage
          height={props.previewImageHeight}
          src={images[0].src}
          alt='preview image'
        />
      </Button>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images}
        plugins={[Thumbnails, Captions]}
        thumbnails={{ref: thumbnailsRef}}
        on={{
          click: () => {
            (thumbnailsRef.current?.visible
              ? thumbnailsRef.current?.hide
              : thumbnailsRef.current?.show)?.()
          },
        }}
      />
    </>
  )
}

export default ImageGallerySRL
