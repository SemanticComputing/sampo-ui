import React from 'react'
import { SRLWrapper, useLightbox } from 'simple-react-lightbox'
import Button from '@material-ui/core/Button'

let options = {
  caption: {
    captionFontFamily: 'roboto'
  }
}

const ImageGallerySRL = props => {
  const { openLightbox } = useLightbox()
  let { data } = props
  if (!Array.isArray(data)) {
    data = [data]
    options = {
      ...options,
      thumbnails: {
        showThumbnails: false
      },
      buttons: {
        showPrevButton: false,
        showNextButton: false,
        showAutoplayButton: false
      }
    }
  }
  const images = data.map(item => {
    return {
      src: item.url,
      thumbnail: item.url,
      caption: item.description
    }
  })
  return (
    <>
      <Button onClick={() => openLightbox()}>
        <img height={props.previewImageHeight} src={images[0].src} />
      </Button>
      <SRLWrapper options={options} images={images} />
    </>
  )
}

export default ImageGallerySRL
