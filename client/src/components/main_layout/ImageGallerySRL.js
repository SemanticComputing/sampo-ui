import React from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Lightbox from 'yet-another-react-lightbox'

const ImgPreviewImage = styled('img')({
  border: '1px solid lightgray'
})

const ImageGallerySRL = props => {
  let { data } = props
  if (!Array.isArray(data)) {
    data = [data]
  }

  const [open, setOpen] = React.useState(false)

  const images = data.map(item => {
    return {
      src: item.url,
      thumbnail: item.url,
      caption: item.description
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
      <Lightbox open={open} close={() => setOpen(false)} slides={images} />
    </>
  )
}

export default ImageGallerySRL
